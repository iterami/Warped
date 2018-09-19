'use strict';

function load_data(){
    canvas_setproperties({
      'properties': {
        'lineWidth': core_storage_data['line-width'],
      },
    });

    let loop_counter = core_storage_data['number-of-entities'] - 1;
    do{
        // Create randomized entity.
        core_entity_create({
          'id': loop_counter,
          'properties': {
            'color': '#' + core_random_hex(),
            'x': core_random_integer({
              'max': canvas_properties['width'],
            }),
            'y': core_random_integer({
              'max': canvas_properties['height'],
            }),
          },
        });
    }while(loop_counter--);
}
