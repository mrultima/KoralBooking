export const enum ImageUploadMessage {
    TOO_LARGE = "File size is greater than allowed",
    EXTENSION = "File extension not allowed",
    LIMIT = "Allowed total number of image",
    DIMENSIONS_HEIGHT = "Allowed range of image height: ",
    DIMENSIONS_MINHEIGHT = "Allowed minimum image height: ",
    DIMENSIONS_MAXHEIGHT = "Allowed maximum image height: ",
    DIMENSIONS_WIDTH = "Allowed range of image width: ",
    DIMENSIONS_MAXWIDTH = "Allowed minimum image width: ",
    DIMENSIONS_MINWIDTH = "Allowed maximum image width: "
}