import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

type BunnyState = {
  container: PIXI.Container;
  bunny: PIXI.Sprite;
  nameTag: PIXI.Container;
  username: string;
  color?: string;
  isMoving: boolean;
  targetX: number;
  jumpPhase: number;
  idleTimer: number;
  isIdle: boolean;
  lastActivity: number;
  lifetime: number;
  maxLifetime: number;
  originalSize: number;
  groundLevel: number;
};

type TwitchMessage = {
  type?: unknown;
  user?: unknown;
  color?: unknown;
  emotes?: unknown;
};

type TwitchEmotePayload = {
  id?: unknown;
};

const twitchConfig = {
  wsUrl: 'wss://api.cg-studio.ru/',
  pingUrl: 'https://api.cg-studio.ru/',
  pingInterval: 10 * 60 * 1000,
  maxBunnies: 10,
  bunnySize: 64,
  groundLevel: 100,
  emoteSize: 50,
  minFlyDuration: 20,
  maxFlyDuration: 30,
  maxDelay: 1.5,
  spreadWidth: 100,
  swayAngle: 10,
  initialLifetime: 5 * 60 * 1000,
  lifetimeExtension: 60 * 1000,
  minSize: 0.1,
  maxSize: 1.0,
  updateInterval: 1000
};

const Twitch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const emoteContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const bunniesRef = useRef<BunnyState[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initPixi = async () => {
      const app = new PIXI.Application();
      await app.init({
        backgroundAlpha: 0,
        resizeTo: window,
        antialias: true
      });
      
      if (!isMounted) {
        app.destroy(true, { children: true, texture: true });
        return;
      }

      appRef.current = app;
      if (containerRef.current) {
        containerRef.current.appendChild(app.canvas);
      }

      const bunnyTexture = await PIXI.Assets.load('https://pixijs.com/assets/bunny.png');

      const connectWebSocket = () => {
        const ws = new WebSocket(twitchConfig.wsUrl);
        wsRef.current = ws;

        ws.onopen = () => console.log('Connected to WebSocket server');
        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting...');
          setTimeout(() => {
            if (isMounted) connectWebSocket();
          }, 3000);
        };
        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as TwitchMessage;
            if (data.type === 'chat_message' && typeof data.user === "string") {
              addOrUpdateBunny(
                data.user,
                typeof data.color === "string" ? data.color : undefined,
                bunnyTexture,
              );
            }
            if (data.type === 'emote' && Array.isArray(data.emotes) && data.emotes.length > 0) {
              data.emotes.forEach((emote) => {
                if (typeof emote !== "object" || emote === null || !("id" in emote)) {
                  return;
                }

                const emoteId = (emote as TwitchEmotePayload).id;
                if (typeof emoteId === "string") {
                  createFlyingEmote(emoteId);
                }
              });
            }
          } catch (err) {
            console.error('Error parsing WebSocket message:', err);
          }
        };
      };

      connectWebSocket();

      const pingInterval = setInterval(() => {
        fetch(twitchConfig.pingUrl).catch(e => console.error('Ping error', e));
      }, twitchConfig.pingInterval);

      app.ticker.add(() => {
        bunniesRef.current.forEach(bunny => updateBunny(bunny, app));
      });

      const lifecycleInterval = setInterval(updateBunnyLifecycle, twitchConfig.updateInterval);

      return () => {
        clearInterval(pingInterval);
        clearInterval(lifecycleInterval);
      };
    };

    const addOrUpdateBunny = (username: string, color: string | undefined, texture: PIXI.Texture) => {
      const existingBunny = bunniesRef.current.find(b => b.username === username);
      if (existingBunny) {
        existingBunny.lastActivity = Date.now();
        existingBunny.lifetime = Math.min(existingBunny.lifetime + twitchConfig.lifetimeExtension, twitchConfig.initialLifetime);
        return;
      }

      if (bunniesRef.current.length >= twitchConfig.maxBunnies) {
        const oldestBunny = bunniesRef.current.reduce((oldest, current) => 
          current.lastActivity < oldest.lastActivity ? current : oldest
        );
        removeBunny(oldestBunny);
      }

      createBunny(username, color, texture);
    };

    const createBunny = (username: string, color: string | undefined, texture: PIXI.Texture) => {
      const app = appRef.current;
      if (!app) return;

      const container = new PIXI.Container();
      app.stage.addChild(container);

      const bunny = new PIXI.Sprite(texture);
      bunny.anchor.set(0.5);
      bunny.width = twitchConfig.bunnySize;
      bunny.height = twitchConfig.bunnySize;
      if (color && color !== '#FF0000') {
        bunny.tint = parseInt(color.replace('#', ''), 16);
      }
      container.addChild(bunny);

      const nameText = new PIXI.Text({
        text: username,
        style: {
          fontFamily: 'Arial',
          fontSize: 14,
          fill: 0x000000,
          fontWeight: 'bold'
        }
      });
      const nameTag = new PIXI.Container();
      nameTag.y = -50;
      const padding = 6;
      const nameTagBg = new PIXI.Graphics();
      nameTagBg.roundRect(-nameText.width/2 - padding, -nameText.height/2 - padding, nameText.width + padding * 2, nameText.height + padding * 2, 6);
      nameTagBg.fill(0xFFFFFF);
      nameTagBg.alpha = 0.8;
      nameTagBg.stroke({ width: 2, color: 0x000000 });
      nameTag.addChild(nameTagBg, nameText);
      nameText.anchor.set(0.5);
      container.addChild(nameTag);

      const groundLevel = app.screen.height - twitchConfig.groundLevel;
      container.x = 100 + (bunniesRef.current.length * 120) % (app.screen.width - 200);
      container.y = groundLevel;

      const bunnyState = {
        container, bunny, nameTag, username, color,
        isMoving: false, targetX: container.x, jumpPhase: 0, idleTimer: 0, isIdle: false,
        lastActivity: Date.now(), lifetime: twitchConfig.initialLifetime, maxLifetime: twitchConfig.initialLifetime,
        originalSize: twitchConfig.bunnySize, groundLevel: groundLevel
      };

      setTimeout(() => startNewMovement(bunnyState), Math.random() * 1000);
      bunniesRef.current.push(bunnyState);
    };

    const removeBunny = (bunny: BunnyState) => {
      const index = bunniesRef.current.indexOf(bunny);
      if (index > -1) {
        bunniesRef.current.splice(index, 1);
        appRef.current?.stage.removeChild(bunny.container);
        bunny.container.destroy({ children: true });
      }
    };

    const updateBunny = (bunny: BunnyState, app: PIXI.Application) => {
      if (bunny.isIdle) {
        bunny.idleTimer -= app.ticker.deltaMS;
        bunny.bunny.y = Math.sin(Date.now() * 0.002) * 2;
        if (bunny.idleTimer <= 0) {
          bunny.isIdle = false;
          startNewMovement(bunny);
        }
        return;
      }
      if (bunny.isMoving) {
        const direction = bunny.targetX > bunny.container.x ? 1 : -1;
        bunny.container.x += direction * 2;
        bunny.jumpPhase += 0.2;
        bunny.bunny.y = Math.sin(bunny.jumpPhase) * 15;
        bunny.bunny.scale.x = Math.abs(bunny.bunny.scale.x) * direction;
        if (Math.abs(bunny.container.x - bunny.targetX) < 5 || bunny.container.x < 50 || bunny.container.x > app.screen.width - 50) {
          bunny.isMoving = false;
          startIdle(bunny);
        }
      }
    };

    const startNewMovement = (bunny: BunnyState) => {
      const padding = 80;
      bunny.targetX = padding + Math.random() * (window.innerWidth - padding * 2);
      bunny.isMoving = true;
      bunny.jumpPhase = 0;
    };

    const startIdle = (bunny: BunnyState) => {
      bunny.isIdle = true;
      bunny.idleTimer = 1000 + Math.random() * 2000;
      bunny.bunny.y = 0;
    };

    const updateBunnyLifecycle = () => {
      const expired: BunnyState[] = [];
      bunniesRef.current.forEach(bunny => {
        bunny.lifetime -= twitchConfig.updateInterval;
        const sizeRatio = Math.max(bunny.lifetime / bunny.maxLifetime, twitchConfig.minSize);
        const newSize = bunny.originalSize * sizeRatio;
        bunny.bunny.width = newSize;
        bunny.bunny.height = newSize;
        bunny.container.y = bunny.groundLevel + (bunny.originalSize - newSize) / 2;
        bunny.nameTag.y = -newSize / 2 - 20;
        if (bunny.lifetime <= 0) expired.push(bunny);
      });
      expired.forEach(removeBunny);
    };

    const createFlyingEmote = (emoteId: string) => {
      if (!emoteContainerRef.current) return;
      const emote = document.createElement('div');
      emote.className = 'absolute bottom-0 z-[1] pointer-events-none opacity-0';
      const duration = Math.random() * (twitchConfig.maxFlyDuration - twitchConfig.minFlyDuration) + twitchConfig.minFlyDuration;
      const delay = Math.random() * twitchConfig.maxDelay;
      const startX = Math.random() * twitchConfig.spreadWidth + (100 - twitchConfig.spreadWidth) / 2;
      const swayAngle = Math.random() * twitchConfig.swayAngle;

      emote.style.left = `${startX}vw`;
      emote.style.animation = `twitch-fly ${duration}s linear ${delay}s forwards`;
      
      const img = document.createElement('img');
      
      if (emoteId.startsWith('uni_')) {
          const hexCode = emoteId.split('_')[1];
          img.src = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${hexCode}.png`;
      } else {
          img.src = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/3.0`;
      }

      img.style.width = `${twitchConfig.emoteSize}px`;
      img.style.height = `${twitchConfig.emoteSize}px`;
      img.style.animation = `twitch-pulse 1.5s ease-in-out infinite, twitch-sway 2s ease-in-out infinite`;
      img.style.setProperty('--sway-angle', `${swayAngle}deg`);

      emote.appendChild(img);
      emoteContainerRef.current.appendChild(emote);
      setTimeout(() => emote.remove(), (duration + delay) * 1000);
    };

    initPixi();

    return () => {
      isMounted = false;
      wsRef.current?.close();
      appRef.current?.destroy(true, { children: true, texture: true });
    };
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent overflow-hidden select-none">
      <style>{`
        @keyframes twitch-fly {
          0% { transform: translateY(0) scale(0.7); opacity: 0; }
          10% { transform: translateY(-10vh) scale(1); opacity: 0.9; }
          90% { transform: translateY(-90vh) scale(1); opacity: 0.9; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        @keyframes twitch-pulse {
          0%, 100% { transform: scale(0.9); }
          50% { transform: scale(1.1); }
        }
        @keyframes twitch-sway {
          0%, 100% { transform: rotate(var(--sway-angle, 0deg)); }
          50% { transform: rotate(calc(var(--sway-angle, 0deg) * -1)); }
        }
      `}</style>
      <div ref={emoteContainerRef} className="absolute inset-0 z-[1]" />
      <div ref={containerRef} className="absolute inset-0 z-[10]" />
    </div>
  );
};

export default Twitch;
