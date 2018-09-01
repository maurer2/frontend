export class Slide {
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
