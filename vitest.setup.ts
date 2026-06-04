import '@testing-library/jest-dom';

class DataTransferMock {
	private readonly _files: File[] = [];

	items = {
		add: (file: File) => {
			this._files.push(file);
		},
	};

	get files(): FileList {
		const files = this._files;

		return Object.assign([...files], {
			item: (index: number) => files[index] ?? null,
		}) as FileList;
	}
}

if (typeof globalThis.DataTransfer === 'undefined') {
	globalThis.DataTransfer = DataTransferMock as typeof DataTransfer;
}

class ResizeObserverMock {
	observe = () => {};
	unobserve = () => {};
	disconnect = () => {};
	constructor(_callback: ResizeObserverCallback) {}
}

if (typeof globalThis.ResizeObserver === 'undefined') {
	globalThis.ResizeObserver =
		ResizeObserverMock as typeof ResizeObserver;
}
