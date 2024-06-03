module.exports = {
    /* 
     * Shuffle - shuffles the answers so that the correct answer doesn't always display first
     * @parm correctAnswer - A string containing the correct answers
     * @param incorrectAnswers - An array of strings containing the incorrect answers
     * @return list - An array of strings containing all the answers in a random order
     */
    answers: function shuffle(correctAnswer,incorrectAnswers){
        
        var allAnswers = [].concat(correctAnswer,incorrectAnswers);
        var ansRemoval = allAnswers;
        var list = [];
        while(ansRemoval.length > 0){
            var idx = Math.floor(Math.random() * ansRemoval.length);
            list.push(allAnswers[idx]);
            ansRemoval.splice(idx,1);
        }
        return list;
    },
    //  List of each category and their respective id's for query/sorting
    sumList: ["Animals","Art","Celebrities","Entertainment: Board Games","Entertainment: Books",
    "Entertainment: Cartoon & Animations","Entertainment: Comics","Entertainment: Film",
    "Entertainment: Japanese Anime & Manga","Entertainment: Music","Entertainment: Musicals & Theatres",
    "Entertainment: Television","Entertainment: Video Games","General Knowledge","Geography","History","Mythology","Politics",
    "Science & Nature","Science: Computers","Science: Gadgets","Science: Mathematics","Sports","Vehicles"
    ],
    // Object array for associating categories with id's so the api query can be made
    categories: [
	
        {
            category: "Animals",
            id: '27'
        },
        
        {
            category: "Art",
            id: '25'
        },
        
        {
            category: "Celebrities",
            id: '26'
        },
        
        {
            category: "Entertainment: Board Games",
            id: '16'
        },
    
        {
            category: "Entertainment: Books",
            id: '10'
        },
    
        {
            category: "Entertainment: Cartoon & Animations",
            id: '32'
        },
    
        {
            category: "Entertainment: Comics",
            id: '29'
        },
    
        {
            category: "Entertainment: Film",
            id: '11'
        },
    
        {
            category: "Entertainment: Japanese Anime & Manga",
            id: '31'
        },
    
        {
            category: "Entertainment: Music",
            id: '12'
        },
    
        {
            category: "Entertainment: Musicals & Theatres",
            id: '13'
        },
    
        {
            category: "Entertainment: Television",
            id: '14'
        },
    
        {
            category: "Entertainment: Video Games",
            id: '15'
        },
    
        {
            category: "General Knowledge",
            id: '9'
        },
    
        {
            category: "Geography",
            id: '22'
        },
    
        {
            category: "History",
            id: '23'
        },
    
        {
            category: "Mythology",
            id: '20'
        },
    
        {
            category: "Politics",
            id: '24'
        },
    
        {
            category: "Science & Nature",
            id: '17'
        },
    
        {
            category: "Science: Computers",
            id: '18'
        },
    
        {
            category: "Science: Gadgets",
            id: '30'
        },
    
        {
            category: "Science: Mathematics",
            id: '19'
        },
    
        {
            category: "Sports",
            id: '21'
        },
    
        {
            category: "Vehicles",
            id: '28'
        },
    ],
    rightAnswer: '', /* Stores the right answer so the user's selected answer can be checked */
    selectedDiff: '', /* Stores the user-selected difficulty */
    // Each mode of difficulty has select multipliers to the score
    multiplier: function calcMultiplier(difficulty){
        if(difficulty == 'easy'){
            return 1;               // 1x multiplier
        }
        if(difficulty == 'medium'){
            return 3;               // 3x multiplier
        }
        if(difficulty == 'hard'){
            return 5;               // 5x multiplier
        }
    },
    /* 
     * findReplace - function to replace unrenderable unicode from strings pulled from the API and replaces them with the right character
     * @param text - A string from the API
     * @return text - Returns the input parameters with all unicode removed
     */
    cleanup: function findReplace(text){
        text = text.replace(/&#039;/g,'\'');
        text = text.replace(/&quot;/g,'\"');
        text = text.replace(/&rsquo;/g,'\'');
        text = text.replace(/&eacute;/g,'e');
        text = text.replace(/&amp;/g,'&');
        return text;
    }
}
