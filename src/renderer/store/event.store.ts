import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { createWithEqualityFn } from 'zustand/traditional';

export interface EventSlice extends EventState {
    actions: {
        favorite: (ids: string[], favorite: boolean) => void;
        play: (id: string) => void;
        rate: (ids: string[], rating: null | number) => void;
    };
}

export interface EventState {
    event: null | UserEvent;
    ids: string[];
}

export type FavoriteEvent = {
    event: 'favorite';
    favorite: boolean;
};

export type PlayEvent = {
    event: 'play';
    timestamp: string;
};

export type RatingEvent = {
    event: 'rating';
    rating: null | number;
};

export type UserEvent = FavoriteEvent | PlayEvent | RatingEvent;

export const useEventStore = createWithEqualityFn<EventSlice>()(
    subscribeWithSelector(
        devtools(
            immer((set) => ({
                actions: {
                    favorite(ids, favorite) {
                        set((state) => {
                            state.event = { event: 'favorite', favorite };
                            state.ids = ids;
                        });
                    },
                    play(id) {
                        set((state) => {
                            state.event = { event: 'play', timestamp: new Date().toISOString() };
                            state.ids = [id];
                        });
                    },
                    rate(ids, rating) {
                        set((state) => {
                            state.event = { event: 'rating', rating };
                            state.ids = ids;
                        });
                    },
                },
                event: null,
                ids: [],
            })),
            { name: 'event_store' },
        ),
    ),
);

export const useFavoriteEvent = () => useEventStore((state) => state.actions.favorite);

export const usePlayEvent = () => useEventStore((state) => state.actions.play);

export const useRatingEvent = () => useEventStore((state) => state.actions.rate);
