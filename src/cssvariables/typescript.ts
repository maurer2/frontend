import { direction } from '@app/global/scripts/direction';
import { Slide } from '@app/global/scripts/slide';
import { BaseGallery } from '@app/base/typescript';

export class CustomPropertiesGallery extends BaseGallery {
    public constructor(protected domNode: HTMLElement) {
        super(domNode);
    }

    protected switchSlides(activeSlide: Slide, newSlide: Slide, directions: Array<direction>): void {
        const [directionNewSlide, directionCurrentSlide] = directions;

        // check window.CSS support and css-var support
        if ((window as any).CSS && CSS.supports('color', 'var(--testvar)')) {
            // define inherit base style for gallery domElement
            this.domNode.style.setProperty('--directionCurrentSlide', 'translateX(0%)');
            // this.domNode.style.setProperty('--directionNewSlide', 'translateX(100%)');

            if (directionNewSlide === direction.next) {
                this.domNode.style.setProperty('--directionNewSlide', 'translateX(100%)');
            } else {
                this.domNode.style.setProperty('--directionNewSlide', 'translateX(-100%)');
            }

            // step 0
            activeSlide.domElement.style.setProperty('transform', 'var(--directionCurrentSlide)');
            newSlide.domElement.style.setProperty('transform', 'var(--directionNewSlide)');

            // step 1
            newSlide.domElement.classList.add('gallery_slide--is-following');

            // step 1.5
            this.adjustHeight(activeSlide, newSlide);

            // Force reflow to stop browsers combining step 1 and step 2
            this.domNode.getBoundingClientRect();

            // step 2 - animate
            if (directionNewSlide === direction.next) {
                this.domNode.style.setProperty('--directionCurrentSlide', 'translateX(-100%)');
            } else {
                this.domNode.style.setProperty('--directionCurrentSlide', 'translateX(100%)');
            }
            this.domNode.style.setProperty('--directionNewSlide', 'translateX(0%)');

            // step 3
            this.slidesContainer.addEventListener('transitionend', (event: TransitionEvent) => {
                const transitionProperty = event.propertyName;
                const transitionSource = event.srcElement as HTMLElement;

                // ignore other event types and transtion-events from within each slide
                if (transitionProperty !== 'transform' && transitionSource !== activeSlide.domElement) {
                    return;
                }

                // stop transition-event bubbling up
                event.stopPropagation();

                // step 4
                newSlide.domElement.className = 'gallery_slide gallery_slide--is-current';
                activeSlide.domElement.className = 'gallery_slide';

                // step 5
                this.updateCounter();

                // step 6
                this.updateControls();
            });
        }
    }
}