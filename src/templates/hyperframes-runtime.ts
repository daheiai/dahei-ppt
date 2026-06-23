export function hyperframesRuntime(totalDuration: number): string {
  return String.raw`
window.__renderSeek = function (time) {
  var clips = Array.from(document.querySelectorAll(".clip"));
  clips.forEach(function (clip) {
    var start = Number(clip.getAttribute("data-start") || "0");
    var duration = Number(clip.getAttribute("data-duration") || "0");
    var end = start + duration;
    var active = time >= start && time <= end;
    clip.classList.toggle("active", active);
  });
};

window.__timelines = window.__timelines || {};
window.__timelines["main"] = {
  duration: function () {
    return ${totalDuration};
  },
  pause: function () {
    return this;
  },
  seek(time) {
    window.__renderSeek(Number(time) || 0);
    return this;
  }
};

window.__renderSeek(0);
`;
}
