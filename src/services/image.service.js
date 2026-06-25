import pexels from "../configs/pexels.js";


export const getDestinationImage = async (destination) => {
    const { data } = await pexels.get("/search", {
        params: {
            query: `${destination} city landmark aerial`,
            per_page: 3,  // get a few, pick best
            orientation: "landscape",
        },
    });

    if (!data.photos.length) return null;

    // pick highest quality one
    return data.photos[0].src.large2x;
};