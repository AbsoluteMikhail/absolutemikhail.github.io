/**
 * СнегоTapochek v.4
 */

(function() {
    // === НАСТРОЙКИ ===
    const CONFIG = {
        count: 25,              
        speed: 1.2,             
        wind: 0.5,              
        color: '#8eb5c9',       
        minSize: 10,            
        maxSize: 22,            
        zIndex: 9999
    };

    let canvas, ctx;
    let flakes = [];
    let w, h;

    function init() {
        canvas = document.createElement('canvas');
        canvas.id = 'snow-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none'; 
        canvas.style.zIndex = CONFIG.zIndex;
        
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');

        onResize();
        window.addEventListener('resize', onResize);

        for (let i = 0; i < CONFIG.count; i++) {
            flakes.push(createFlake());
        }

        requestAnimationFrame(loop);
    }

    function createFlake(initial = true) {
        return {
            x: Math.random() * w,
            y: initial ? Math.random() * h : -30,
            size: CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
            speedMod: Math.random() * 0.6 + 0.4, 
            windMod: Math.random() * 0.5 + 0.5,
        };
    }

    function onResize() {
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = CONFIG.color;
        
		for (let i = 0; i < flakes.length; i++) { 
			let f = flakes[i];
            
            ctx.font = f.size + "px sans-serif";
            // \u{2744} - код снежинки для Canvas. \u{1F989} - сова
            ctx.fillText("\u{2744}", f.x, f.y); 

            // Физика
            f.y += CONFIG.speed * f.speedMod;
            f.x += Math.sin(f.y * 0.005) * CONFIG.wind * f.windMod;

            // Респавн
            if (f.y > h + 30) {
                flakes[i] = createFlake(false);
            }
            if (f.x > w + 30) f.x = -30;
            if (f.x < -30) f.x = w + 30;
        }
        
        requestAnimationFrame(loop);
    }

    // === КУКИ И КНОПКИ ===
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

    function isSnowEnabled() {
        return getCookie('snow_enabled') !== 'false';
    }

    window.toggleSnow = function() {
        setCookie('snow_enabled', isSnowEnabled() ? 'false' : 'true', 365);
        location.reload();
    };

    if (typeof window.jQuery !== 'undefined') {
        window.jQuery(function($) {
            var btn = $('#toggle-snow');
            if (btn.length) {
                btn.text(isSnowEnabled() ? '\u2744 Выкл. снег' : '\u2744 Вкл. снег');
            }
        });
    }

    if (isSnowEnabled()) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }
})();