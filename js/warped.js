'use strict';

function draw_logic(){
    /*
    if(settings['clear']){
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }
    */

    for(var object in objects){
        // Draw rectangles if not in lines mode.
        if(mode != 1){
            buffer.fillStyle = objects[object]['color'];
            buffer.fillRect(
              objects[object]['x'],
              objects[object]['y'],
              objects[object]['x'] - mouse_x,
              objects[object]['y'] - mouse_y
            );
        }

        // Draw lines if not in rectangles mode.
        if(mode != 2){
            buffer.beginPath();
            buffer.moveTo(
              objects[object]['x'],
              objects[object]['y']
            );

            var extra_x = 0;
            var extra_y = 0;
            var target_x = mouse_x - objects[object]['x'];
            var target_y = mouse_y - objects[object]['y'];

            if(settings['line-fixed-length'] !== 0){
                var length = Math.sqrt(
                  target_x * target_x + target_y * target_y
                );

                target_x /= length;
                target_x *= settings['line-fixed-length'];
                target_y /= length;
                target_y *= settings['line-fixed-length'];
            }

            if(settings['line-length-multiplier'] !== 1){
                target_x *= settings['line-length-multiplier'];
                target_y *= settings['line-length-multiplier'];
            }

            if(settings['line-extra-length'] !== 0){
                extra_x = mouse_x - objects[object]['x'];
                extra_y = mouse_y - objects[object]['y'];

                var length = Math.sqrt(
                  extra_x * extra_x + extra_y * extra_y
                );

                extra_x /= length;
                extra_x *= settings['line-extra-length'];
                extra_y /= length;
                extra_y *= settings['line-extra-length'];
            }

            buffer.lineTo(
              objects[object]['x'] + target_x + extra_x,
              objects[object]['y'] + target_y + extra_y
            );
            buffer.closePath();
            buffer.strokeStyle = objects[object]['color'];
            buffer.stroke();
        }
    }

    /*
    if(settings['clear']){
        canvas.clearRect(
          0,
          0,
          width,
          height
        );
    }
    */
}

function random_hex(){
    var choices = '0123456789abcdef';
    return '#'
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16))
      + choices.charAt(Math.floor(Math.random() * 16));
}

function randomize_objects(){
    objects.length = 0;

    var loop_counter = settings['number-of-objects'] - 1;
    do{
        // Create randomized object.
        objects.push({
          'color': random_hex(),
          'x': Math.floor(Math.random() * width),
          'y': Math.floor(Math.random() * height),
        });
    }while(loop_counter--);

    draw();
}

function resize_logic(){
    mouse_y = y;
    mouse_x = x;

    buffer.lineWidth = settings['line-width'];
    mouse_drag = false;
    randomize_objects();
}

function setmode_logic(){
    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick=setmode(3,true)>Both</a><br><a onclick=setmode(1,true)>Lines</a><br><a onclick=setmode(2,true)>Rectangles</a></div></div><div class=right><div><input disabled value=ESC>Main Menu<br><input id=randomize-key maxlength=1 value='
          + settings['randomize-key'] + '>Randomize</div><hr><div><label><input '
          + (settings['clear'] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=line-extra-length value='
          + settings['line-extra-length'] + '>Line Extra Length<br><input id=line-fixed-length value='
          + settings['line-fixed-length'] + '>Line Fixed Length<br><input id=line-length-multiplier value='
          + settings['line-length-multiplier'] + '>Line Length Multiplier<br><input id=line-width value='
          + settings['line-width'] + '>Line Width<br><label><input '
          + (settings['mouse-lock'] ? 'checked ' : '') + 'id=mouse-lock type=checkbox>Mouse Lock</label><br><input id=number-of-objects value='
          + settings['number-of-objects'] + '>Objects<br><a onclick=reset()>Reset Settings</a></div></div>';

    // Visualization mode.
    }else{
        save();
    }
}

var objects = [];
var mouse_drag = false;
var mouse_x = 0;
var mouse_y = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // settings['randomize-key']: randomize current objects.
    if(String.fromCharCode(key) === settings['randomize-key']){
        randomize_objects();

    // ESC: return to the main menu.
    }else if(key === 27){
        setmode(0);
    }
};

window.onload = function(){
    init_settings(
      'Warped.htm-',
      {
        'clear': true,
        'line-extra-length': 0,
        'line-fixed-length': 0,
        'line-length-multiplier': 1,
        'line-width': 1,
        'randomize-key': 'R',
        'mouse-lock': true,
        'number-of-objects': 100,
      }
    );
    init_canvas();
};

window.onmousedown =
  window.ontouchstart = function(e){
    if(mode <= 0){
        return;
    }

    mouse_drag = true;
    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onmousemove = function(e){
    if(mode <= 0
      || (!settings['mouse-lock'] && !mouse_drag)){
        return;
    }

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    draw();
};

window.onmouseup = function(e){
    mouse_drag = false;
};
