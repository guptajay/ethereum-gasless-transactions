export interface CommandLineStatisticsPresenterConfig {
    urlTruncateToLength: number;
    txHashTruncateToLength: number;
    valuesTruncateToLength: number;
    nativeTokenTickerSymbol: string;
    averageBlocksPerDay: number;
    daysToPlotTransactions: number;
    blockExplorerUrl?: string;
}
export declare const defaultCommandLineStatisticsPresenterConfig: CommandLineStatisticsPresenterConfig;
