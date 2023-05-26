import { sveltekit } from '@sveltejs/kit/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		nodePolyfills({
			exclude: ['fs'],
			protocolImports: true
		})
	],
	resolve: {
		alias: {
			fs: 'memfs'
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: '@use "src/variables.scss" as *;'
			}
		}
	}
}

export default config
