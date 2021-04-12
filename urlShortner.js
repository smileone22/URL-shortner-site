
class URLShortener {
    constructor (originalURL,sURL='',clickCount=0) {
        this.originalURL = originalURL;
        this.clickCount =clickCount;
        this.shortURL=sURL;    
    }

	// Returns Short URL
    shorten() {
        let protocol='http';
        let domain='localhost:3000';
        let howlong =6; 
        let uniq = '';
        let chars = "abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890";
        for ( var i = 0; i < howlong; i++ ) {
            uniq += chars.charAt(Math.floor(Math.random() * chars.length));
         }  
        this.shortURL=protocol+'://'+domain+'/'+uniq;
        return this.shortURL;
    }

	// Returns Expanded URL
    expand() {
        return this.originalURL; 
    }

	// Updates Click count
    updateClickCount() {
        this.clickCount=(parseInt(this.clickCount)+1).toString();
    }

}

module.exports ={
    URLShortener: URLShortener
};