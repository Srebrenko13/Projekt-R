export default class Commands {
    static state(s) {
        return `{"state": "${s}"}`
    }

    static brightness(b) {
        return `{"brightness": "${b}"}`
    }

    static colorTemp(c) {
        return `{"color_temp": "${c}"}`
    }

    static colorXYHEX(c) {
        return `{"color":{"hex":"${c}"}}`
    }

    static colorXYRGB(c) {
        return `{"color":{"rgb":"${c}"}}`
    }
}