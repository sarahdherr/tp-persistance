$(function initializeMap() {

  const fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  const styleArr = [
    {
      featureType: 'landscape',
      stylers: [{ saturation: -100 }, { lightness: 60 }]
    },
    {
      featureType: 'road.local',
      stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
    },
    {
      featureType: 'transit',
      stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
    },
    {
      featureType: 'administrative.province',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      stylers: [{ visibility: 'on' }, { lightness: 30 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.fill',
      stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry.fill',
      stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
    }
  ];

  const mapCanvas = document.getElementById('map-canvas');

  const currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

  // const iconURLs = {
  //   hotel: '/images/lodging_0star.png',
  //   restaurant: '/images/restaurant.png',
  //   activity: '/images/star-3.png'
  // };

  function drawMarker(type, coords) {
    // TODO: Pan map / recalculate viewport here maybe?
    const latLng = new google.maps.LatLng(coords[0], coords[1]);
    const marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(currentMap);
    return marker
  }


  // 0. Fetch the database, parsed from json to a js object

  // const db = fetch('/api').then((r) => {
  //   console.log('**FETCH**', r);
  //   r.json();
  // });

  const db = $.ajax({
    method: 'GET',
    url: '/api'
  })
  .then((data) => {
    console.log('**FETCH**', data);
    return data;
  })
  .catch();

  // TODO:
  // 1. Populate the <select>s with <option>s
  $('select').each(
    (_index, select) => {
      db.then(db =>
        $(select).append(
          db[select.dataset.type].map(
            item => Object.assign(
              $(`<option>${item.name}</option>`)[0]
              , {
                item: item,
              })
          )
        )
      )
    })

  // 2. Wire up the add buttons
  // We could do this if we wanted to select by the add
  // dataset item instead:
  //
  //   $('button[data-action="add"]').click(
  $('button.add').click(
    evt =>
      $(evt.target.dataset.from)
        .find('option:selected')
        .each((_i, option) => {
          const item = option.item
            , type = $(option)
              .closest('select')[0]
              .dataset.type

          // Make a li out of this item
          const li = $(`<li>${item.name} <button class='del'>x</button></li>`)[0]

          // Draw a marker on the map and attach the marker to the li
          li.marker = drawMarker(type, item.place.location)

          // Add this item to our itinerary for the current day
          $('.current.day').append(li)
        })
  )

  // 3. Wire up delete buttons
  $(document).on('click', 'button.del',
    evt => $(evt.target).closest('li').each((_i, li) => {
      li.marker.setMap(null)
      $(li).remove()
    })
  )

  // 4. Deal with adding days
  // $('button.addDay').click(
  //   evt => {
  //     // Deselect all days
  //     $('.day.current').removeClass('current')

  //     // Add a new day
  //     $(evt.target).before(
  //       $(`<ol class="current day"><h3><span class=day-head></span><button class=delDay>x</button></h3></ol>`)
  //     )

  //     numberDays()
  //   }
  // )

  function numberDays() {
    $('.day').each((index, day) =>
      $(day).find('.day-head').text(`Day ${index + 1}`)
    )
  }

  // 5. Deal with switching days
  $(document).on('click', '.day-head',
    evt => {
      $('.day.current').removeClass('current')
      const $day = $(evt.target).closest('.day')

      $('li').each((_i, li) => li.marker && li.marker.setMap(null))
      $day.addClass('current')
      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
    }
  )

  // 6. Remove a day
  $(document).on('click', 'button.delDay',
    evt => {
      const $day = $(evt.target).closest('.day')
      const dayNumber = $day[0].id;
      if ($day.hasClass('current')) {
        const prev = $day.prev('.day')[0]
          , next = $day.next('.day')[0]
        $day.removeClass('current')
        $(prev || next).addClass('current')
      }

      $day.find('li').each((_i, li) => li.marker.setMap(currentMap))
      $day.remove()
      var dayUrl = '/api/days/' + dayNumber;
      $.ajax({
        method: 'DELETE',
        url: dayUrl
      })
      .then(function(message) {
        console.log(message);
      })
      numberDays()
    })

  // When we start, add a day
  // $('button.addDay').click()



});

$(function initializeDay() {

  $(document).on('click', 'button.addDay', function () {
    $.ajax({
      method: 'GET',
      url: '/api/days'
    })
      .then(function (data) { console.log('GET response data: ', data) })
      .catch(console.error.bind(console));

    // select the number of day we want to make
    console.log($('.addDay').prev('ol')[0]);
    var dayNumber = +$('.addDay').prev('ol')[0].id + 1;
    console.log('When addDay, new day Num', dayNumber);
    var newUrl = '/api/days/' + dayNumber;
    $.ajax({
      method: 'POST',
      url: newUrl
    })
      .then(function (data) {
        console.log('POST response data: ', data)
        $.ajax({
          method: 'GET',
          url: '/api/days'
        })
          .then(function(days) {
            renderDays(days);
          })
      })

      .catch(console.error.bind(console));
  });

  $.ajax({
    method: 'GET',
    url: '/api/days'
  })
    .then(function (data) {
      console.log(data)
      if (data.length < 1) {
        console.log('We made it to the IF!!!')
        $.ajax({
          method: 'POST',
          url: '/api/days/1'
        })
          .then(function (day) {
            console.log('Day One now exists', day)
            $newDay = $(`<ol id=${day.number} class="current day"><h3><span class=day-head>Day ${day.number}</span><button class=delDay>x</button></h3></ol>`)
            $('.addDay').before($newDay);
          })
          .catch(console.error.bind(console));
      }
      else {
        // we have our data
        renderDays(data);
      }
    })

  function renderDays(days) {
    $($(".addDay").siblings()).remove();

    days.forEach(function (day) {
      $newDay = $(`<ol id=${day.number} class="day"><h3><span class=day-head>Day ${day.number}</span><button class=delDay>x</button></h3></ol>`)
      $('.addDay').before($newDay);
    })

    // add current class to last day
    $($('.addDay').prev('ol')[0]).addClass('current');
  }


});
