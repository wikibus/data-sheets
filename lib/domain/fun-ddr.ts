export type EventsWithIris<T> = { [P in keyof T]?: T[P] & { iri?: string } }
