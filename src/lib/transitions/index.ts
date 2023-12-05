import { cubicOut, quadOut } from 'svelte/easing';
import type { EasingFunction, TransitionConfig } from 'svelte/transition';

interface FadeScaleParams {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	opacity?: number;
}

export function fadeScale(
	node: HTMLElement,
	{ delay = 0, duration = 400, easing = quadOut, opacity = 0 }: FadeScaleParams = {}
): TransitionConfig {
	const h = +node.offsetHeight;
	const style = getComputedStyle(node);
	const mt = parseInt(style.marginTop, 10);
	const mb = parseInt(style.marginBottom, 10);
	const target_opacity = +style.opacity;
	const od = target_opacity * (1 - opacity);
	return {
		delay,
		duration,
		easing,
		css: (t, u) =>
			`height: ${t * h}px; margin-top: ${t * mt}px; margin-bottom: ${t * mb}px; opacity: ${
				target_opacity - od * u
			}; overflow: hidden`,
	};
}

interface FlyScaleParams {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	x?: number;
	y?: number;
	opacity?: number;
}

export function flyScale(
	node: HTMLElement,
	{ delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }: FlyScaleParams = {}
): TransitionConfig {
	const h = +node.offsetHeight;
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;
	const od = target_opacity * (1 - opacity);
	return {
		delay,
		duration,
		easing,
		css: (t, u) =>
			`height: ${t * h}px; transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
    opacity: ${target_opacity - od * u}; overflow: hidden`,
	};
}
