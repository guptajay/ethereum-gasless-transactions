"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const semver_1 = __importDefault(require("semver"));
class VersionsManager {
    /**
     * @param componentVersion - a semver of a component that uses the VersionsManager
     * @param requiredVersionRange - a semver that has to be satisfied by the
     */
    constructor(componentVersion, requiredVersionRange) {
        if (semver_1.default.valid(componentVersion) == null) {
            throw new Error('Component version is not valid');
        }
        if (requiredVersionRange == null) {
            const ver = new semver_1.default.SemVer(componentVersion);
            ver.patch = 0;
            requiredVersionRange = '^' + ver.format();
        }
        this.requiredVersionRange = requiredVersionRange;
    }
    /**
     * @param version - the version of a dependency to compare against
     * @return true if {@param version} satisfies the {@link requiredVersionRange}
     */
    isRequiredVersionSatisfied(version) {
        // prevent crash with some early paymasters (which are otherwise perfectly valid)
        version = version.replace('_', '-');
        return semver_1.default.satisfies(version, this.requiredVersionRange, { includePrerelease: true });
    }
}
exports.VersionsManager = VersionsManager;
//# sourceMappingURL=VersionsManager.js.map