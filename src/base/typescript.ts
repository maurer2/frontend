import { direction } from '@app/global/scripts/direction';
import { Slide } from '@app/global/scripts/slide';

export class BaseGallery {
    private static directionStrings: Array<direction> = [direction.next, direction.previous];
    protected slidesContainer: HTMLElement;
    private slides: Array<Slide>;
    private linkNextSlide: HTMLLinkElement;
    private linkPreviousSlide: HTMLLinkElement;
    private navEntries: Array<HTMLElement>;
    private slideInterval: number;

    public constructor(protected domNode: HTMLElement) {
        const slidesList = this.domNode.querySelectorAll('.gallery_slide') as NodeListOf<HTMLElement>;
        const navEntries = this.domNode.querySelectorAll('.gallery_nav-entry') as NodeListOf<HTMLButtonElement>;

        this.slides = Array.prototype.map.call(slidesList, (element: HTMLElement, index: number) => new Slide(element, index));
        this.navEntries = Array.prototype.map.call(navEntries, (element: HTMLElement) => element);
        this.slidesContainer = this.domNode.querySelector('.gallery_slides') as HTMLElement;
        this.linkNextSlide = this.domNode.querySelector('.gallery_next') as HTMLLinkElement;
        this.linkPreviousSlide = this.domNode.querySelector('.gallery_prev') as HTMLLinkElement;

        this.registerEvents();
        this.updateControls();
        // this.enableAutoslide();
    }

    protected registerEvents(): void {
        this.linkNextSlide.addEventListener('click', (event: Event) => this.slideNext());
        this.linkPreviousSlide.addEventListener('click', (event: Event) => this.slidePrevious());

        this.domNode.addEventListener('mouseenter', (event: MouseEvent) => {
            // this.cancelAutoSlide();
        });
        this.domNode.addEventListener('mouseleave', (event: MouseEvent) => {
            // this.enableAutoslide();
        });
        this.navEntries.forEach((element: HTMLButtonElement, index) => {
            element.addEventListener('click', (event: MouseEvent) => {
                this.slideTo(index);
            });
        });
    }

    protected slideNext(): void {
        const activeSlide: Slide = (this.slides as any).find((slide: Slide) => slide.isCurrent());
        const newSlide: Slide = this.slides[activeSlide.getIndex() + 1];

        if (activeSlide.isLast()) {
            return;
        }

        this.switchSlides(activeSlide, newSlide, BaseGallery.directionStrings);
    }

    protected slidePrevious(): void {
        const activeSlide: Slide = (this.slides as any).find((slide: Slide) => slide.isCurrent());
        const newSlide: Slide = this.slides[activeSlide.getIndex() - 1];

        if (activeSlide.isFirst()) {
            return;
        }

        this.switchSlides(activeSlide, newSlide, BaseGallery.directionStrings.slice().reverse());
    }

    protected slideTo(slideIndex: number): void {
        const activeSlide: Slide = (this.slides as any).find((slide: Slide) => slide.isCurrent());
        const newSlide: Slide = this.slides[slideIndex];
        let directionStrings: Array<direction> = BaseGallery.directionStrings;

        if (newSlide === null || activeSlide.getIndex() === newSlide.getIndex()) {
            return;
        }

        if (activeSlide.getIndex() > newSlide.getIndex()) {
            directionStrings = BaseGallery.directionStrings.slice().reverse();
        }

        this.switchSlides(activeSlide, newSlide, directionStrings);
    }

    protected switchSlides(activeSlide: Slide, newSlide: Slide, directions: Array<direction>): void {
        const [directionNewSlide, directionCurrentSlide] = directions;

        // step 1
        newSlide.domElement.classList.add('gallery_slide--is-following');
        newSlide.domElement.classList.add(`gallery_slide--is-out-of-${directionNewSlide}-bound`);

        // step 1.5
        this.adjustHeight(activeSlide, newSlide);

        // Force reflow to stop browsers combining step 1 and step 2
        this.domNode.getBoundingClientRect();

        // step 2
        activeSlide.domElement.classList.add(`gallery_slide--is-out-of-${directionCurrentSlide}-bound`);
        newSlide.domElement.classList.remove(`gallery_slide--is-out-of-${directionNewSlide}-bound`);

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

    protected enableAutoslide(): void {
        this.slideInterval = window.setInterval(() => {
            this.slideNext();
        }, 5000);
    }

    protected cancelAutoSlide(): void {
        window.clearInterval(this.slideInterval);
    }

    protected adjustHeight(activeSlide: Slide, newSlide: Slide): void {
        const currentHeight: number = activeSlide.getHeight();
        const newHeight: number = newSlide.getHeight();
        const slideDuration: number = parseFloat(window.getComputedStyle(activeSlide.domElement)
            .getPropertyValue('transition-duration')) * 1000 || 500;

        this.slidesContainer.style.height = currentHeight + 'px';
        window.setTimeout(() => {
            this.slidesContainer.style.height = newHeight + 'px';
        }, slideDuration);
    }

    protected updateCounter(): void {
        const activeSlide = (this.slides as any).find((slide: any) => slide.isCurrent());
        const inactiveSlides = this.slides.filter((slide) => !slide.isCurrent());
        const activeNavEntry = (this.navEntries as any).find((element: HTMLElement, index: number) => index === activeSlide.getIndex());
        const inactiveNavEntries = this.navEntries.filter((element, index) => index !== activeSlide.getIndex());

        activeNavEntry.classList.add('gallery_nav-entry--is-current');
        inactiveNavEntries.forEach((element) => {
            element.classList.remove('gallery_nav-entry--is-current');
        });
    }

    protected updateControls(): void {
        const activeSlide = (this.slides as any).find((slide: Slide) => slide.isCurrent());

        if (activeSlide.isFirst()) {
            this.linkPreviousSlide.classList.add('gallery_prev--is-inactive');
            this.linkPreviousSlide.disabled = true;
        } else {
            this.linkPreviousSlide.classList.remove('gallery_prev--is-inactive');
            this.linkPreviousSlide.disabled = false;
        }

        if (activeSlide.isLast()) {
            this.linkNextSlide.classList.add('gallery_next--is-inactive');
            this.linkNextSlide.disabled = true;
        } else {
            this.linkNextSlide.classList.remove('gallery_next--is-inactive');
            this.linkNextSlide.disabled = false;
        }
    }

}