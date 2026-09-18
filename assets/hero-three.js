import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var canvas = document.getElementById("hero-canvas");
  var hero = document.querySelector(".hero");
  if (!canvas || !hero) return;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  } catch (e) {
    return;
  }

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 9;

  var colors = [0xc6ef2e, 0x16c4c0, 0x2c6fef, 0x3ddbd3, 0xc6ef2e];
  var geometries = [
    new THREE.IcosahedronGeometry(1.05, 0),
    new THREE.OctahedronGeometry(0.85, 0),
    new THREE.TorusGeometry(0.7, 0.22, 8, 24),
    new THREE.TetrahedronGeometry(0.95, 0),
    new THREE.IcosahedronGeometry(0.6, 0)
  ];

  var group = new THREE.Group();
  var meshes = geometries.map(function (geo, i) {
    var mat = new THREE.MeshBasicMaterial({
      color: colors[i % colors.length],
      wireframe: true,
      transparent: true,
      opacity: 0.5
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 9,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4
    );
    mesh.userData.axis = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();
    mesh.userData.speed = 0.15 + Math.random() * 0.3;
    group.add(mesh);
    return mesh;
  });
  scene.add(group);

  function size() {
    var w = hero.clientWidth;
    var h = hero.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  var mouseX = 0;
  var mouseY = 0;
  window.addEventListener(
    "pointermove",
    function (e) {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true }
  );

  window.addEventListener("resize", size);
  size();

  var rafId = null;
  function animate() {
    rafId = requestAnimationFrame(animate);
    meshes.forEach(function (m) {
      m.rotateOnAxis(m.userData.axis, m.userData.speed * 0.012);
    });
    group.rotation.y += (mouseX * 0.5 - group.rotation.y) * 0.02;
    group.rotation.x += (mouseY * 0.25 - group.rotation.x) * 0.02;
    renderer.render(scene, camera);
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (rafId === null) animate();
        } else if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    });
    io.observe(hero);
  } else {
    animate();
  }
})();
