var player = {};

player.el                    =  {};
player.el.container          =  document.querySelector( '.pipboy' );
player.el.video              =  player.el.container.querySelector( 'video' );
player.el.controls_bottom    =  player.el.container.querySelector( '.pipboy--base--square--bottom--protection--controls' );
player.el.toggle_play        =  player.el.controls_bottom.querySelector( '.pipboy--base--square--bottom--protection--controls--button--1' );
player.el.toggle_replay      =  player.el.controls_bottom.querySelector( '.pipboy--base--square--bottom--protection--controls--button--2' );
player.el.toggle_muted       =  player.el.controls_bottom.querySelector( '.pipboy--base--square--bottom--protection--controls--button--3' );
player.el.screen_controls    =  player.el.container.querySelector( '.pipboy--base--square--screenborder--screen--controls' );
player.el.progress_bar       =  player.el.screen_controls.querySelector( '.pipboy--base--square--screenborder--screen--controls--progress' );
player.el.progress_bar_full  =  player.el.screen_controls.querySelector( '.pipboy--base--square--screenborder--screen--controls--progress--bar' );
player.el.time               =  player.el.screen_controls.querySelector( '.pipboy--base--square--screenborder--screen--controls--time' );
player.el.toggle_full_screen =  player.el.screen_controls.querySelector( '.pipboy--base--square--screenborder--screen--controls--fullscreen' );
player.el.base_controls      =  player.el.container.querySelector( '.pipboy--base--controls' );
player.el.volume_more        =  player.el.base_controls.querySelector( '.pipboy--base--controls--volume--indicator--more' );
player.el.volume_less        =  player.el.base_controls.querySelector( '.pipboy--base--controls--volume--indicator--less' );
player.el.volume_bar         =  player.el.base_controls.querySelector( '.pipboy--base--controls--volume--indicator--bar' );
player.el.volume_wheel       =  player.el.base_controls.querySelector( '.pipboy--base--controls--volume--wheel' );
player.el.qualitie_1080p     =  player.el.base_controls.querySelector( '.pipboy--base--controls--qualities--txt--1' );
player.el.qualitie_720p      =  player.el.base_controls.querySelector( '.pipboy--base--controls--qualities--txt--2' );
player.el.qualitie_540p      =  player.el.base_controls.querySelector( '.pipboy--base--controls--qualities--txt--3' );
player.el.qualitie_360p      =  player.el.base_controls.querySelector( '.pipboy--base--controls--qualities--txt--4' );
player.el.wheel_line         =  player.el.base_controls.querySelector( '.pipboy--base--controls--selector--lines' );


//play button
player.el.toggle_play.addEventListener( 'click', function( event ){
  if( player.el.video.paused )
    player.el.video.play();
  else
    player.el.video.pause();
  event.preventDefault();
});

//play update
player.el.video.addEventListener( 'play', function() {
  player.el.container.classList.add( 'playing' );
});
player.el.video.addEventListener( 'pause', function() {
  player.el.container.classList.remove( 'playing' );
});

//muted button
player.el.toggle_muted.addEventListener( 'click', function( event ){
  if( player.el.video.muted )
    player.el.video.muted = false;
  else
    player.el.video.muted = true;
  event.preventDefault();
});

//muted update
player.el.video.addEventListener( 'volumechange', function() {
  if( player.el.video.muted || player.el.video.volume === 0)
    player.el.container.classList.add( 'muted' );
  else
    player.el.container.classList.remove( 'muted' );
});

//replay
player.el.toggle_replay.addEventListener( 'click', function( event ) {
  player.el.video.currentTime = 0;
  event.preventDefault();
});

//toggle full screen
player.el.toggle_full_screen.addEventListener( 'click', function( event ){
  if (player.el.video.requestFullscreen)
    player.el.video.requestFullscreen();
  else if (player.el.video.mozRequestFullScreen)
    player.el.video.mozRequestFullScreen();
  else if (player.el.video.webkitRequestFullscreen)
    player.el.video.webkitRequestFullscreen();
  event.preventDefault();
});

//toggle progress bar
var progress_mouse_over,
    progress_mouse_down;

player.el.progress_bar.addEventListener( 'mouseenter', function( event ) {
  progress_mouse_over = true;
});
player.el.progress_bar.addEventListener( 'mouseleave', function( event ) {
  progress_mouse_over = false;
});

document.addEventListener( 'mousedown', function( event ) {
  if (progress_mouse_over)
    progress_mouse_down = true;
});
document.addEventListener( 'mouseup', function( event ) {
  progress_mouse_down = false;
});

document.addEventListener( 'mousemove', function( event ) {
  var progress_bar_width = player.el.progress_bar.offsetWidth,
      progress_bar_left  = player.el.container.offsetLeft,
      mouse_x            = event.clientX,
      ratio              = ( mouse_x - progress_bar_left + 113 ) / progress_bar_width,
      time               = ratio * player.el.video.duration;

  if (progress_mouse_down)
    player.el.video.currentTime = time;

  event.preventDefault();
});

player.el.progress_bar.addEventListener( 'mousedown', function( event ) {
  var progress_bar_width = player.el.progress_bar.offsetWidth,
      progress_bar_left  = player.el.container.offsetLeft,
      mouse_x            = event.clientX,
      ratio              = ( mouse_x - progress_bar_left + 113 ) / progress_bar_width,
      time               = ratio * player.el.video.duration;

  player.el.video.currentTime = time;
  event.preventDefault();
});

//update progress bar and time
var update_progress_bar = function() {
  var duration = player.el.video.duration,
      time     = player.el.video.currentTime,
      ratio    = time / duration,
      dur_minutes = "0" + Math.floor(duration / 60),
      dur_seconds = "0" + Math.floor(duration % 60),
      dur_final = dur_minutes.substr(-2) + ":" + dur_seconds.substr(-2),
      time_minutes = "0" + Math.floor(time / 60),
      time_seconds = "0" + Math.floor(time % 60),
      time_final = time_minutes.substr(-2) + ":" + time_seconds.substr(-2);
  player.el.time.innerText = time_final + ' / ' + dur_final;

  player.el.progress_bar_full.style.transform = 'scaleX(' + ratio + ')';
  requestAnimationFrame(update_progress_bar);
};
requestAnimationFrame(update_progress_bar);

//volume control
function volume_control(){
  var angle  = 20,
      volume;
  player.el.volume_more.addEventListener( 'mousedown', function( event ) {
    volume = Math.round(1000 * player.el.video.volume)/1000;
    if ( volume < 1 ) {
      player.el.video.volume = volume + 0.1;
      angle = angle + 10;
      player.el.volume_bar.style.transform = 'rotate(' + angle + 'deg)';
      player.el.volume_wheel.style.transform = 'rotate(' + ( angle * 1.5 ) + 'deg)';
    }
    event.preventDefault();
  });
  player.el.volume_less.addEventListener( 'mousedown', function( event ) {
    volume = Math.round(1000 * player.el.video.volume)/1000;
    if ( volume > 0 ) {
      player.el.video.volume = volume - 0.1;
      angle = angle - 10;
      player.el.volume_bar.style.transform = 'rotate(' + angle + 'deg)';
      player.el.volume_wheel.style.transform = 'rotate(' + ( angle * 1.5 ) + 'deg)';
    }
    event.preventDefault();
  });
}
volume_control();

//select qualities
player.el.qualitie_1080p.addEventListener( 'click', function( event ) {
  var time = player.el.video.currentTime;
  player.el.video.setAttribute('src', 'videos/fallout_720.mp4');
  player.el.wheel_line.style.transform = 'translateY(0px)';
  player.el.container.classList.add( 'q1080' );
  player.el.container.classList.remove( 'q720' );
  player.el.container.classList.remove( 'q540' );
  player.el.container.classList.remove( 'q360' );
  if( player.el.video.played )
    player.el.video.play();
  player.el.video.currentTime = time;
  event.preventDefault();
});
player.el.qualitie_720p.addEventListener( 'click', function( event ) {
  var time = player.el.video.currentTime;
  player.el.video.setAttribute('src', 'videos/fallout_720.mp4');
  player.el.wheel_line.style.transform = 'translateY(20px)';
  player.el.container.classList.add( 'q720' );
  player.el.container.classList.remove( 'q1080' );
  player.el.container.classList.remove( 'q540' );
  player.el.container.classList.remove( 'q360' );
  if( player.el.video.played )
    player.el.video.play();
  player.el.video.currentTime = time;
  event.preventDefault();
});
player.el.qualitie_540p.addEventListener( 'click', function( event ) {
  var time = player.el.video.currentTime;
  player.el.video.setAttribute('src', 'videos/fallout_360.mp4');
  player.el.wheel_line.style.transform = 'translateY(40px)';
  player.el.container.classList.add( 'q540' );
  player.el.container.classList.remove( 'q720' );
  player.el.container.classList.remove( 'q1080' );
  player.el.container.classList.remove( 'q360' );
  if( player.el.video.played )
    player.el.video.play();
  player.el.video.currentTime = time;
  event.preventDefault();
});
player.el.qualitie_360p.addEventListener( 'click', function( event ) {
  var time = player.el.video.currentTime;
  player.el.video.setAttribute('src', 'videos/fallout_360.mp4');
  player.el.wheel_line.style.transform = 'translateY(60px)';
  player.el.container.classList.add( 'q360' );
  player.el.container.classList.remove( 'q720' );
  player.el.container.classList.remove( 'q540' );
  player.el.container.classList.remove( 'q1080' );
  if( player.el.video.played )
    player.el.video.play();
  player.el.video.currentTime = time;
  event.preventDefault();
});

//keyboard control
document.addEventListener( 'keypress', function( event ) {
  if ( player.el.video.paused && ( event.keyCode == 32 || event.keyCode == 112 ) )
    player.el.video.play();
  else if ( player.el.video.play && ( event.keyCode == 32 || event.keyCode == 112 ) )
    player.el.video.pause();
  else if ( player.el.video.muted && event.keyCode == 109 )
    player.el.video.muted = false;
  else if ( player.el.video.muted === false && event.keyCode == 109 )
    player.el.video.muted = true;
  event.preventDefault();
});
