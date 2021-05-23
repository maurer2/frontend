import { direction } from '@app/global/scripts/direction';
import { Slide } from '@app/global/scripts/slide';
import { BaseGallery } from '@app/base/typescript';

export class GridGallery extends BaseGallery {
    public constructor(protected domNode: HTMLElement) {
        super(domNode);
    }

    protected switchSlides(activeSlide: Slide, newSlide: Slide, directions: direction[]): void {
        const [directionNewSlide, directionCurrentSlide] = directions;

        // step 1
        newSlide.domElement.classList.add(
            directionNewSlide === 'right'
            ? 'gallery_slide--is-following'
            : 'gallery_slide--is-preceding'
        );

        // step2
        this.domNode.getBoundingClientRect();

        // step 3
        newSlide.domElement.className = 'gallery_slide gallery_slide--is-current';
        activeSlide.domElement.className = 'gallery_slide';

        // step 4
        super.updateCounter();
        super.updateControls();
    }
}