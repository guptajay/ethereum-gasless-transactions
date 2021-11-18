"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TypedRequestData_1 = require("./TypedRequestData");
// register a forwarder for use with GSN: the request-type and domain separator we're using.
async function registerForwarderForGsn(forwarderTruffleOrWeb3, sendOptions = undefined) {
    let options = sendOptions;
    let forwarder;
    if (forwarderTruffleOrWeb3.contract != null) {
        forwarder = forwarderTruffleOrWeb3.contract;
        // truffle-contract carries default options (e.g. from) in the object.
        // @ts-ignore
        options = Object.assign(Object.assign({}, forwarderTruffleOrWeb3.constructor.defaults()), sendOptions);
    }
    else {
        options = sendOptions;
        forwarder = forwarderTruffleOrWeb3;
    }
    function logTx(p) {
        p.on('transactionHash', function (hash) {
            console.debug(`Transaction broadcast: ${hash}`);
        });
        p.on('error', function (err) {
            console.debug(`tx error: ${err.message}`);
        });
        return p;
    }
    await logTx(forwarder.methods.registerRequestType(TypedRequestData_1.GsnRequestType.typeName, TypedRequestData_1.GsnRequestType.typeSuffix).send(options));
    await logTx(forwarder.methods.registerDomainSeparator(TypedRequestData_1.GsnDomainSeparatorType.name, TypedRequestData_1.GsnDomainSeparatorType.version).send(options));
}
exports.registerForwarderForGsn = registerForwarderForGsn;
//# sourceMappingURL=ForwarderUtil.js.map