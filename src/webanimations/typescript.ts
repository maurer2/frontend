import { direction } from '@app/global/scripts/direction';
import { Slide } from '@app/global/scripts/slide';
import { BaseGallery } from '@app/base/typescript';

export class WebAnimationGallery extends BaseGallery {
    public constructor(protected domNode: HTMLElement) {
        super(domNode);
    }

    protected switchSlides(activeSlide: Slide, newSlide: Slide, directions: Array<direction>): void {
        if (!('animate' in (activeSlide.domElement as any))) {
            super.switchSlides(activeSlide, newSlide, directions);
            return;
        }

        // step 1
        newSlide.domElement.classList.add('gallery_slide--is-following');

        // step 2 animate
        const slideOutActiveSlide: any = (activeSlide.domElement as any).animate([
            {transform: 'translateX(0%)'},
            {transform: 'translateX(-100%)'},
        ], 500);
        const slideInNewSlide: any = (newSlide.domElement as any).animate([
            {transform: 'translateX(100%)'},
            {transform: 'translateX(0%)'},
        ], 500);

        // step 3 cleanup classes
        // todo Promisify callbacks for chrome

        // @ts-ignore
        Promise.all([slideOutActiveSlide.finished, slideInNewSlide.finished])
            .then(() => {
                newSlide.domElement.className = 'gallery_slide gallery_slide--is-current';
                activeSlide.domElement.className = 'gallery_slide';
            })
            .then(() => {
                super.updateCounter();
            });
    }
}