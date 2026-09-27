import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installAssetRecovery, recoverAssetLoad } from "@/lib/assetRecovery";

beforeEach(() => {
  sessionStorage.clear();
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
});
afterEach(() => vi.restoreAllMocks());

describe("asset recovery", () => {
  it("reloads only once for this bundle, even after the module is re-created", async () => {
    const reload = vi.fn();
    expect(recoverAssetLoad(reload)).toBe(true);
    expect(recoverAssetLoad(reload)).toBe(false);
    vi.resetModules();
    const fresh = await import("@/lib/assetRecovery");
    expect(fresh.recoverAssetLoad(reload)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not spend the recovery attempt while offline", () => {
    const reload = vi.fn();
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    expect(recoverAssetLoad(reload)).toBe(false);
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
    expect(recoverAssetLoad(reload)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it("does not risk a reload loop when session storage is unavailable", () => {
    const reload = vi.fn();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage blocked"); });
    expect(recoverAssetLoad(reload)).toBe(false);
    expect(reload).not.toHaveBeenCalled();
  });

  it("lets a rejected import reach the error UI when recovery is unavailable", () => {
    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const dispose = installAssetRecovery();
    const event = new Event("vite:preloadError", { cancelable: true });
    expect(window.dispatchEvent(event)).toBe(true);
    expect(event.defaultPrevented).toBe(false);
    dispose();
  });
});
