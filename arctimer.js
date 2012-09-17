/*! 
    arctimer jQuery Plugin
    v 1.0
    
    HTML5 timer that uses canvas to draw a countdown arc.
    
    written by Sam-Mauris Yong / mauris@hotmail.sg
    Source code released open source under New BSD License.    
!*/

(function($){
    
    /* let's now extend jQuery! */
    $.fn.arctimer = function(){
    
        /* The default options */
        var options = {
            
            /* the color of the fill or stroke for the timer
               defaults to the use of a random colour */
            color: '#'+Math.floor(Math.random()*16777215).toString(16),
            
            /* the time to countdown in miliseconds */
            countdown: 5000,
            
            /* sets the direction the arc will countdown from */
            clockwise: true,
            
            /* the thickness of the stroke. 100% will set the arc to fill mode instead */
            thickness: '100%',
            
            /* width and height of the arc (it's a square) */
            width: '50px',
            
            /* the interval to refresh the arc at */
            interval: 50,
            
            /* the start position to draw from */
            startPosition: Math.PI / 2 * 3,
            
            /* the callback for each interval tick. this is set to the arctimer control object and first paramter is the percentage of the timer from 0 to 1 */
            ticker: function(){},
            
            /* the callback function for when the arctimer completes */
            callback: function(){}
        };
        
        switch(arguments.length){
            case 1: 
                if(arguments[0] instanceof Object){
                    $.each(arguments[0], function(key, value){
                        options[key] = value;                
                    });
                }else{
                    options.countdown = arguments[0];
                }
                break;
            case 2:
                if(arguments[1] instanceof Object){
                    $.each(arguments[1], function(key, value){
                        options[key] = value;                
                    });
                }else{
                    options.callback = arguments[1];
                }
                options.countdown = arguments[0]
                break;
            case 3:
                $.each(arguments[1], function(key, value){
                    options[key] = value;                
                });
                options.callback = arguments[2];
                options.countdown = arguments[0]
                break;
        }
        
        /* Loop through and prepare the canvas objects.  */
        var elements = [];
        this.each(function(){
            var canvas = this;
            var nodeName = this.nodeName.toLowerCase();
            
            /* Looks like a div was passed in. It's okay, we can create a canvas inside it.  */
            if(nodeName == 'div'){
                var tcanvas = $('<canvas></canvas>');
                canvas = tcanvas[0];
                canvas.width = parseInt(options.width);
                canvas.height = parseInt(options.width);
                $(this).append(canvas);
                nodeName = 'canvas';
            }
            if(nodeName != 'canvas'){
                throw "Selected item is not a canvas or div, but is a " + nodeName + " instead.";
            }else{
                options.width = Math.min(canvas.width, canvas.height);
                elements.push(canvas);
            }
        });
        
        /* The fantastic arctimer control object */
        var control = {
            options: options,
            start: function(){
                elapse = 0;
                this.resume();
            },
            stop: function(){
                elapse = 0;
                timerCallback();
                elapse = 0;
                this.pause();
            },
            pause: function(){
                timer = window.clearInterval(timer);
            },
            resume: function(){
                timer = window.setInterval(timerCallback, options.interval);
            },
            set: function(percent){
                var angle = percent * Math.PI * 2;
                var startAngle = options.startPosition;
                var endAngle = (options.clockwise ? angle : -angle) + options.startPosition;
                $.each(elements, function(){
                    options.ticker.call(control, percent);
                    var canvas = this;
                    var ctx = canvas.getContext("2d");
                    ctx.strokeStyle = options.color;
                    ctx.fillStyle = options.color; 
                    ctx.lineWidth = options.thickness;
                    ctx.beginPath();
                    ctx.arc(canvas.width / 2, canvas.height / 2, (canvas.width - ctx.lineWidth) / 2, startAngle, endAngle, !options.clockwise);
                    if(options.thickness == '100%'){
                        ctx.lineTo(canvas.width / 2, canvas.width / 2);
                        ctx.moveTo(canvas.width / 2, 0);
                        ctx.fill();
                    }else{
                        if(typeof options.thickness !== 'string'){
                            options.thickness = parseInt(options.thickness);
                        }
                        ctx.lineWidth = options.thickness;
                        ctx.stroke();
                    }
                });
            }
        };
        var elapse = 0;
        var timerCallback = function(){
            control.set(elapse / options.countdown);
            elapse += options.interval;
            if(elapse > options.countdown){
                options.callback.call(control);
                timer = window.clearInterval(timer);
            }
        };
        var timer = window.setInterval(timerCallback, options.interval);
        
        return control;
    };
})(jQuery);