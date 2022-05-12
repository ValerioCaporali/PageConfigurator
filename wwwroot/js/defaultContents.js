export default class DefaultContents {
    
    constructor() { }
    
    textContent = {
        text: "<h3 style='font-style: italic;'>Inserisci qui il testo</h3>"
    };
    
    gallerySource = {
        source:  [
            'https://newb2bapi.falc.biz/api/v1/media/public/blobs/public/home/images/2022/SS22/banner_1.jpg',
            'https://newb2bapi.falc.biz/api/v1/media/public/blobs/public/home/images/2022/SS22/banner_2.jpg'
        ],
        showIndicator: false,
        showNavButtons: false,
        enableLoop: true,
        slideShowDelay: 3000,
        serverSideScalingEnabled: false,
        cacheEnabled: true
    };
    
    horizontalAndGridGallerySource = {
        source: [
            'assets/images/image.jpg',
            'assets/images/image.jpg',
            'assets/images/image.jpg',
            'assets/images/image.jpg',            
            'assets/images/image.jpg',
            'assets/images/image.jpg',
            'assets/images/image.jpg',
            'assets/images/image.jpg'
        ]
    }
    
    videoSource = {
        source: 'https://www.youtube.com/embed/X91__O-5zz8'
    };
    
    webPageSource = {
        source: 'https://it.wikipedia.org/wiki/Pagina_principale'
    };
    
    showcaseSource = {
        source: 'https://my.matterport.com/show/?m=xx7GChUUBii'
    };
    
    pdfSource = {
        source: 'https://api.b2b.flowers.usalesman.it/api/v1/media/public/blobs/artnova/catalog.pdf'
    };
    
    mapContent = {
        latitude: 45.480423,
        longitude: 9.386593
    };
}