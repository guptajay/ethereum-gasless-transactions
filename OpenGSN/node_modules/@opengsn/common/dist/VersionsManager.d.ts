export declare class VersionsManager {
    readonly requiredVersionRange: string;
    /**
     * @param componentVersion - a semver of a component that uses the VersionsManager
     * @param requiredVersionRange - a semver that has to be satisfied by the
     */
    constructor(componentVersion: string, requiredVersionRange?: string);
    /**
     * @param version - the version of a dependency to compare against
     * @return true if {@param version} satisfies the {@link requiredVersionRange}
     */
    isRequiredVersionSatisfied(version: string): boolean;
}
