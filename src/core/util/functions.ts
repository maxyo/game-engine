export function sleep(ms = 0) {
    if (ms === 0) {
        return;
    }
    return new Promise(r => setTimeout(r, ms));
}
