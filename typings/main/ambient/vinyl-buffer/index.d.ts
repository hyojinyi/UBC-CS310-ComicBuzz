// Generated by typings
// Source: https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/1a4b2f0ff98d7b1071474c4ab16f2626d9a62d31/vinyl-buffer/vinyl-buffer.d.ts
// Type definitions for vinyl-buffer
// Project: https://github.com/hughsk/vinyl-buffer
// Definitions by: Qubo <https://github.com/tkQubo>
// Definitions: https://github.com/borisyankov/DefinitelyTyped


declare module "vinyl-buffer" {
    namespace buffer {
        interface Buffer {
            (): NodeJS.ReadWriteStream;
        }
    }

    var buffer: buffer.Buffer;

    export = buffer;
}