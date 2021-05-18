import { direction } from '@app/global/scripts/direction';
import { Slide } from '@app/global/scripts/slide';
import { BaseGallery } from '@app/base/typescript';

export class GridGallery extends BaseGallery {
    public constructor(protected domNode: HTMLElement) {
        super(domNode);
    }

    protected switchSlides(activeSlide: Slide, newSlide: Slide, directions: direction[]): void {
        console.log(activeSlide, newSlide, directions)
    }
}