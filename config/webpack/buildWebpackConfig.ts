import webpack, {ResolveOptions} from 'webpack';
import { BuildOptions } from './types/config';
import { buildPlugins } from './buildPlugins';
import { buildLoaders } from './buildLoaders';
import { buildResolvers } from './buildResolvers';
import { buildDevServer } from './buildDevServer';

export function buildWebpackConfig(options: BuildOptions): {
    mode: "production" | "development";
    output: { path: string; filename: string; clean: boolean; publicPath: string };
    devtool: string;
    devServer: Configuration<import("express").Application, import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>>;
    entry: string;
    resolve: ResolveOptions;
    plugins: WebpackPluginInstance[];
    module: { rules: RuleSetRule[] }
} {
    const { paths, mode, isDev } = options;

    return {
        mode,
        entry: paths.entry,
        output: {
            filename: '[name].[contenthash].js',
            path: paths.build,
            clean: true,
            publicPath: '/',
        },
        plugins: buildPlugins(options),
        module: {
            rules: buildLoaders(options),
        },
        resolve: buildResolvers(options),
        devtool: isDev ? 'eval-cheap-module-source-map' : undefined,
        devServer: isDev ? buildDevServer(options) : undefined,
    };
}
