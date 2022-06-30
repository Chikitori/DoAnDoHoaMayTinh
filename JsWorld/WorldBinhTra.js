import { createCamera } from '../JsModule/Camera.js';
import { createTeapot} from '../JsWorld/Teapot.js';
import { createCube } from '../JsWorld/Cube.js';
import { createSphere } from '../JsWorld/Sphere.js';
import { createSpotLight } from '../JsWorld/spotlight.js';
import { createCylinder } from '../JsWorld/Cylinder.js';
import { createWheel} from '../JsWorld/Wheel.js';
import { createCone } from '../JsWorld/Cone.js';
import { createScene } from '../JsModule/Scene.js';
import { createRenderer } from '../JsModule/Renderer.js';
import { Resizer } from '../JsModule/Resizer.js';
import { createHuman} from './Human.js';
import { createPlane} from './Plane.js';
import { Loop} from '../JsModule/Loop.js';
import { OrbitControls } from 'https://unpkg.com/three@0.119.1/examples/jsm/controls/OrbitControls.js';

let camera;
let renderer;
let scene;
let loop;
let controls;
let controlsGUI;

class World {
  constructor(container) {
    camera = createCamera(35, 1, 0.1, 2000, 60, 2, 0);
    scene = createScene();
    renderer = createRenderer();
    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    loop = new Loop(camera, scene, renderer, controls);
    container.append(renderer.domElement);

    const plane = createPlane(0, 0, 0, 200, 200, Math.PI/2, Math.PI, Math.PI);
    const sphere = createSphere(5, 30, 30, 0, 0);
    const cube = createCube(5, 0, 0 , 0);
    const cone = createCone(1,0,30,0,5);
    const cylinder = createCylinder(1, 0, 0, 30 ,5);
    const wheels = createWheel(10, -70, 0, 0, false);
    const teapot = createTeapot(1,2,1);
    const spotLight1 = createSpotLight(-100, 20, 0, 50, 0.5, 0.4, true, 0xffffff);
    spotLight1.target = teapot;
    const spotLight = createSpotLight(0, 20, 0, 0, 1, 0.4, true, 0xffffff);
    spotLight.target = teapot;

    
    loop.updatables.push(spotLight1);
    


    // scene.add(cube1);
    // scene.add(cube2);
    // scene.add(human);

    // scene.add(sphere);
    // scene.add(cube);
    // scene.add(cone);
    // scene.add(cylinder);
    //scene.add(wheels);
    
    this.createGUIDAT(teapot, wheels, spotLight, spotLight1, scene);
    // loop.updatables.push(teapot);
    scene.add(teapot);
    scene.add(plane);
    scene.add(spotLight1);
    scene.add(spotLight);

    renderer.shadowMap.enabled = true;
    const resizer = new Resizer(container, camera, renderer);
    resizer.onResize = () => {
      this.render();
    };
  }
  
  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }
  
  stop() {
    loop.stop();
  }

  createGUIDAT(teapot, wheels, spotLight, spotLight1, scene){
    this.controlsGUI = {
      rotationX : 0,
      rotationY : 0,
      rotationZ : 0,
      positionX : 0,
      positionY : 0,
      positionZ : 0,
      scaleX: 0.7,
      scaleY: 0.75,
      scaleZ: 1,
      near: 0.1,
      far: 2000,
    };
    var lightGUI = {
      big: true,
      moving: true,
    }
    var displayModeGUI = {
      wireframe: false,
      solid: true
    };

    const gui = new dat.GUI();
    gui.add(this.controlsGUI, 'rotationX', 0, 360).onChange(value => {
      teapot.rotation.x = this.convertDegToRad(value);
      this.render();
    });
    gui.add(this.controlsGUI, 'rotationY', 0, 360).onChange(value => {
      teapot.rotation.y = this.convertDegToRad(value);
      this.render();
    });
    gui.add(this.controlsGUI, 'rotationZ', 0, 360).onChange(value => {
      teapot.rotation.z = this.convertDegToRad(value);
      this.render();
    });

    gui.add(this.controlsGUI, 'positionX', -1000, 1000).onChange(value => {
      teapot.position.x = this.convertDegToRad(value);
      this.render();
    });
    gui.add(this.controlsGUI, 'positionY', -1000, 1000).onChange(value => {
      teapot.position.y = this.convertDegToRad(value);
      this.render();
    });
    gui.add(this.controlsGUI, 'positionZ', -1000, 1000).onChange(value => {
      teapot.position.z = this.convertDegToRad(value);
      this.render();
    });

    gui.add(this.controlsGUI, 'scaleX', -10, 10).onChange(value => {
      teapot.scale.x = value;
      this.render();
    });
    gui.add(this.controlsGUI, 'scaleY', -10, 10).onChange(value => {
      teapot.scale.y = value;
      this.render();
    });
    gui.add(this.controlsGUI, 'scaleZ', -10, 10).onChange(value => {
      teapot.scale.z = value;
      this.render();
    });
    const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
    gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near').onChange(this.updateCamera);
    gui.add(minMaxGUIHelper, 'max', 0.1, 2000, 0.1).name('far').onChange(this.updateCamera);
    var first = gui.addFolder("Display Mode");
    var second = gui.addFolder("Light On/Off");
    second.add(lightGUI, 'big').name('Big Light').listen().onChange(function(){
      if(lightGUI["big"]) {
        lightGUI["big"] = true; 
        scene.add(spotLight);
      }
      else {
        lightGUI["big"] = false; 
        scene.remove(spotLight); 
      }
    });

    second.add(lightGUI, 'moving').name('Moving Light').listen().onChange(function(){
      if(lightGUI["moving"]) {
        lightGUI["moving"] = true; 
        scene.add(spotLight1);
      }
      else {
        lightGUI["moving"] = false; 
        scene.remove(spotLight1); 
      }
    });

    first.add(displayModeGUI, 'wireframe').name('Wireframe').listen().onChange(function(){setChecked("wireframe", displayModeGUI); setWireframe(teapot, wheels);});
    first.add(displayModeGUI, 'solid').name('Solid').listen().onChange(function(){setChecked("solid", displayModeGUI); setSolid(teapot, wheels);});
    function setChecked(prop, list){
      for (let param in list){
        list[param] = false;
      }
        list[prop] = true;
    }
    function setWireframe(teapot, wheels) {
      wheels.material = new THREE.MeshPhongMaterial({
        color:0xffffff,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });

      teapot.getObjectByName('Body').material = new THREE.MeshPhongMaterial({
        color:0xc4c4c4,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });

      teapot.getObjectByName('Head').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });

      teapot.getObjectByName('TopHead').material = new THREE.MeshPhongMaterial({
        color:0xe4e4e4,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });

        
      teapot.getObjectByName('Tail').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });

      teapot.getObjectByName('Gunn').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: true,
        point:true
      });
    }
  
    function setSolid(teapot, wheels){
      wheels.material = new THREE.MeshPhongMaterial({
        color:0xffffff,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });
      teapot.getObjectByName('Body').material = new THREE.MeshPhongMaterial({
        color:0xc4c4c4,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });

      teapot.getObjectByName('Head').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });

      teapot.getObjectByName('TopHead').material = new THREE.MeshPhongMaterial({
        color:0xe4e4e4,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });

        
      teapot.getObjectByName('Tail').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });

      teapot.getObjectByName('Gunn').material = new THREE.MeshPhongMaterial({
        color:0xd4d4d4,
        side: THREE.DoubleSide,
        wireframe: false,
        point:true
      });
    }
  }
    
  

  updateCamera() {
    camera.updateProjectionMatrix();
  }
  
  convertDegToRad(deg) {
    return deg * Math.PI / 180;
  }
}

class MinMaxGUIHelper {
  constructor(obj, minProp, maxProp, minDif) {
    this.obj = obj;
    this.minProp = minProp;
    this.maxProp = maxProp;
    this.minDif = minDif;
  }
  get min() {
    return this.obj[this.minProp];
  }
  set min(v) {
    this.obj[this.minProp] = v;
    this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
  }
  get max() {
    return this.obj[this.maxProp];
  }
  set max(v) {
    this.obj[this.maxProp] = v;
    this.min = this.min;  // this will call the min setter
  }
  
}



export { World };


