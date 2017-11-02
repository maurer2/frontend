enum direction {
    next = 'right',
    previous = 'left',
}

class Slide {
    public constructor(public domElement: HTMLElement, private index: number) {}

    public isCurrent(activeClass = 'gallery_slide--is-current'): boolean {
        return this.domElement.classList.contains(activeClass);
    }

    public isLast(): boolean {
        const nextSibling = this.domElement.nextElementSibling as HTMLElement;
        return nextSibling === null;
    }

    public isFirst(): boolean {
        const previousSibling = this.domElement.previousElementSibling as HTMLElement;
        return previousSibling === null;
    }

    public getIndex(): number {
        return this.index;
    }

    public getHeight(excludeMargins: boolean = false): number {
        const marginTop: number = parseInt(window.getComputedStyle(this.domElement).marginTop, 10);
        const marginBottom: number = parseInt(window.getComputedStyle(this.domElement).marginBottom, 10);
        const innerHeight = this.domElement.clientHeight;

        return excludeMargins ? innerHeight : innerHeight + marginTop + marginBottom;
    }
}

class BaseGallery {
    private static directionStrings: Array<direction> = [direction.next, direction.previous];
    private slides: Array<Slide>;
    private slidesContainer: HTMLElement;
    private linkNextSlide: HTMLLinkElement;
    private linkPreviousSlide: HTMLLinkElement;
    private navEntries: Array<HTMLElement>;
    private slideInterval: number;

    public constructor(private domNode: HTMLElement) {
        const slidesList = this.domNode.querySelectorAll('.gallery_slide') as NodeListOf<HTMLElement>;
        const navEntries = this.domNode.querySelectorAll('.gallery_nav-entry') as NodeListOf<HTMLElement>;

        this.slides = Array.prototype.map.call(slidesList, (element, index) => new Slide(element, index));
        this.navEntries = Array.prototype.map.call(navEntries, (element) => element);
        this.slidesContainer = this.domNode.querySelector('.gallery_slides') as HTMLElement;
        this.linkNextSlide = this.domNode.querySelector('.gallery_next') as HTMLLinkElement;
        this.linkPreviousSlide = this.domNode.querySelector('.gallery_prev') as HTMLLinkElement;

        this.registerEvents();
        this.enableAutoslide();
    }

    private registerEvents(): void {
        this.linkNextSlide.addEventListener('click', (event: Event) => {
            this.slideNext();
        });
        this.linkPreviousSlide.addEventListener('click', (event: Event) => {
            this.slidePrevious();
        });
        this.domNode.addEventListener('mouseenter', (event: MouseEvent) => {
            this.cancelAutoSlide();
        });
        this.domNode.addEventListener('mouseleave', (event: MouseEvent) => {
            this.enableAutoslide();
        });
    }

    private adjustHeight(activeSlide: Slide, newSlide: Slide): void {
        const currentHeight: number = activeSlide.getHeight();
        const newHeight: number = newSlide.getHeight();
        const slideDuration: number = parseFloat(window.getComputedStyle(activeSlide.domElement)
        .getPropertyValue('transition-duration')) * 1000 || 500;

        this.slidesContainer.style.height = currentHeight + 'px';
        window.setTimeout(() => {
            this.slidesContainer.style.height = newHeight + 'px';
        }, slideDuration);
    }

    private slideNext(): void {
        const activeSlide: Slide = this.slides.find((slide) => slide.isCurrent());
        const newSlide: Slide = this.slides[activeSlide.getIndex() + 1];

        if (activeSlide.isLast()) {
            return;
        }

        this.switchSlides(activeSlide, newSlide, BaseGallery.directionStrings);
    }

    private slidePrevious(): void {
        const activeSlide: Slide = this.slides.find((slide) => slide.isCurrent());
        const newSlide: Slide = this.slides[activeSlide.getIndex() - 1];

        if (activeSlide.isFirst()) {
            return;
        }

        this.switchSlides(activeSlide, newSlide, BaseGallery.directionStrings.slice().reverse());
    }

    private switchSlides(activeSlide: Slide, newSlide: Slide, directions: Array<direction>): void {
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
            // newSlide.domElement.classList.add('gallery_slide--is-current');
            // newSlide.domElement.classList.remove('gallery_slide--is-following');
            // activeSlide.domElement.classList.remove('gallery_slide--is-current');
            // activeSlide.domElement.classList.remove(`gallery_slide--is-out-of-${directionCurrentSlide}-bound`);

            // step 5
            this.updateCounter();
        });
    }

    private enableAutoslide(): void {
        this.slideInterval = window.setInterval(() => {
            this.slideNext();
        }, 5000);
    }

    private cancelAutoSlide(): void {
        window.clearInterval(this.slideInterval);
    }

    private updateCounter(): void {
        const activeSlide = this.slides.find((slide) => slide.isCurrent());
        const inactiveSlides = this.slides.filter((slide) => !slide.isCurrent());
        const activeNavEntry = this.navEntries.find((element, index) => index === activeSlide.getIndex());
        const inactiveNavEntries = this.navEntries.filter((element, index) => index !== activeSlide.getIndex());

        activeNavEntry.classList.add('gallery_nav-entry--is-current');
        inactiveNavEntries.forEach((element) => {
            element.classList.remove('gallery_nav-entry--is-current');
        });
    }
}

const galleryBase = new BaseGallery(document.querySelector('.gallery--base') as HTMLElement);
