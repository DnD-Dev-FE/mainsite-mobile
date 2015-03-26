jQuery.fn.activeMenu = function(activeClass) {

  var activeClassCSS = "Active";

  if (activeClass.length>0){
    activeClassCSS = activeClass;
  }

  var cObj = this; // 
  var cUrl = "//"+ window.location.hostname + window.location.pathname;    
  var new_Url = cUrl;
  if ((window.location.pathname == "/") || (window.location.pathname == "/app_dev.php/")) {
    new_Url = cUrl + "index.html";    
  }
  if ((window.location.pathname == "") || (window.location.pathname == "/app_dev.php")) {
    new_Url = cUrl + "/index.html";    
  }
  
  cUrl = new_Url ;  

  
  function similar(a,b) {
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;  
    var maxLength = (a.length < b.length) ? b.length : a.length;  
    for(var i = 0; i < minLength; i++) {
      if(a[i] == b[i]) {
        equivalency++;
      }
    }
    var weight = equivalency / maxLength;
    return (weight * 100) + "%";
  }

  function specialLink(pathName){

      var splitPathNameLocal = pathName.split("?");    
      var splitPathName = splitPathNameLocal[0].split("/");
      
        objs.each(function(el){
          var $this = $(this);
          var LinkTagA = $this.attr("href");

        for (var j = 0 ; j < splitPathName.length ; j++ ){ 
          if ((splitPathName[j] == "app_dev.php") || (splitPathName[j] == "")) {            
          } else {  
            if ((LinkTagA.search(splitPathName[j]) > 0) || (LinkTagA.search(splitPathName[j]) > 0)) {             
            
              $this.addClass(activeClassCSS);
              return false;
            }
            
          }
        }   
       
      });
  }

  var objs = cObj.find("a");
  var maxP = 0;
  var csObj = false;
  
  objs.each(function(el) {
    var $this = $(this);
    var matchP = parseFloat(similar($this.attr("href"), cUrl));    
    if(matchP > maxP) {
      maxP = matchP;          
      csObj = $this;
    }
  });



  if(maxP >= 90) {      
  	csObj.addClass(activeClassCSS);  	
  } else {
    specialLink(window.location.pathname);
  } 

  return this;
};

if($('#main-nav__list').length) {    
    $("#main-nav__list").activeMenu("active");
}