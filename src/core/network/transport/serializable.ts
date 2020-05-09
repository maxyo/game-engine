import {hashStr} from "../../util/functions";
import {NetworkType} from "./network-type";
import shortid = require("shortid");

export class Serializable {

    static netScheme = {};

    public constructor(properties = {}) {
        Object.assign(this, properties);
    }

    /**
     *  Class can be serialized using either:
     * - a class based netScheme
     * - an instance based netScheme
     * - completely dynamically (not implemented yet)
     *
     * @param {Object} serializer - Serializer instance
     * @param {Object} [options] - Options object
     * @param {Object} options.dataBuffer [optional] - Data buffer to write to. If null a new data buffer will be created
     * @param {Number} options.bufferOffset [optional] - The buffer data offset to start writing at. Default: 0
     * @param {String} options.dry [optional] - Does not actually write to the buffer (useful to gather serializeable size)
     * @return {Object} the serialized object.  Contains attributes: dataBuffer - buffer which contains the serialized data;  bufferOffset - offset where the serialized data starts.
     */
    serialize(serializer, options: any = {}) {
        options = Object.assign({
            bufferOffset: 0
        }, options);

        let netScheme;
        let dataBuffer;
        let dataView;
        let classId = hashStr(this.constructor.name);
        let bufferOffset = options.bufferOffset;
        let localBufferOffset = 0; // used for counting the bufferOffset

        // instance netScheme
        if (this.constructor.netScheme) {
            netScheme = this.constructor.netScheme;
        } else {
            console.warn('no netScheme defined! This will result in awful performance');
        }

        if (options.dataBuffer == null && options.dry != true) {
            let bufferSize = this.serialize(serializer, {dry: true}).bufferOffset;
            dataBuffer = new ArrayBuffer(bufferSize);
        } else {
            dataBuffer = options.dataBuffer;
        }

        if (options.dry != true) {
            dataView = new DataView(dataBuffer);
            dataView.setUint8(bufferOffset + localBufferOffset, classId);
        }

        // advance the offset counter
        localBufferOffset += Uint8Array.BYTES_PER_ELEMENT;

        if (netScheme) {
            for (let property of Object.keys(netScheme)) {

                // write the property to buffer
                if (options.dry != true) {
                    serializer.writeDataView(dataView, this[property], bufferOffset + localBufferOffset, netScheme[property]);
                }

                if (netScheme[property].type === NetworkType.STRING) {
                    // derive the size of the string
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;
                    if (this[property] !== null && this[property] !== undefined)
                        localBufferOffset += this[property].length * Uint16Array.BYTES_PER_ELEMENT;
                } else if (netScheme[property].type === NetworkType.REFERENCE) {
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT; // length
                    if (this[property] !== null && this[property] !== undefined && this[property].id !== undefined) {
                        localBufferOffset += this[property].id.length * Uint16Array.BYTES_PER_ELEMENT;
                    }
                } else if (netScheme[property].type === NetworkType.CLASSINSTANCE) {
                    // derive the size of the included class
                    let objectInstanceBufferOffset = this[property].serialize(serializer, {dry: true}).bufferOffset;
                    localBufferOffset += objectInstanceBufferOffset;
                } else if (netScheme[property].type === NetworkType.LIST) {
                    // derive the size of the list
                    // list starts with number of elements
                    localBufferOffset += Uint16Array.BYTES_PER_ELEMENT;

                    for (let item of this[property]) {
                        // todo inelegant, currently doesn't support list of lists
                        if (netScheme[property].itemType === NetworkType.CLASSINSTANCE) {
                            let listBufferOffset = item.serialize(serializer, {dry: true}).bufferOffset;
                            localBufferOffset += listBufferOffset;
                        } else if (netScheme[property].itemType === NetworkType.STRING) {
                            // size includes string length plus double-byte characters
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.length);
                        } else if (netScheme[property].itemType === NetworkType.REFERENCE) {
                            localBufferOffset += Uint16Array.BYTES_PER_ELEMENT * (1 + item.id.length);
                        } else {
                            localBufferOffset += serializer.getTypeByteSize(netScheme[property].itemType);
                        }
                    }
                } else {
                    // advance offset
                    localBufferOffset += serializer.getTypeByteSize(netScheme[property].type);
                }

            }
        } else {
            // TODO no netScheme, dynamic class
        }

        return {dataBuffer, bufferOffset: localBufferOffset};
    }

    // build a clone of this object with pruned strings (if necessary)
    prunedStringsClone(serializer, prevObject) {

        if (!prevObject) return this;
        prevObject = serializer.deserialize(prevObject).obj;

        // get list of string properties which changed
        let netScheme = this.constructor.netScheme;
        let isString = p => netScheme[p].type === NetworkType.STRING;
        let hasChanged = p => prevObject[p] !== this[p];
        let changedStrings = Object.keys(netScheme).filter(isString).filter(hasChanged);
        if (changedStrings.length == 0) return this;

        // build a clone with pruned strings
        // @ts-ignore
        let prunedCopy = new this.constructor();
        for (let p of Object.keys(netScheme))
            prunedCopy[p] = changedStrings.indexOf(p) < 0 ? this[p] : null;

        return prunedCopy;
    }

    syncTo(other) {
        let netScheme = this.constructor.netScheme;
        for (let p of Object.keys(netScheme)) {

            if (netScheme[p].type === NetworkType.LIST)
                continue;
            if (netScheme[p].type === NetworkType.CLASSINSTANCE) {
                this[p].syncTo(other[p]);
                continue;
            }
            if (netScheme[p].type === NetworkType.STRING) {
                if (typeof other[p] === 'string') this[p] = other[p];
                continue;
            }

            this[p] = other[p];
        }
    }

}
