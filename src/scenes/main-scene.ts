import Particle = Phaser.GameObjects.Particles.Particle;

interface IImageConstructor {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame?: string | number;
}

interface ShipSpecs {
    max_acceleration: number,
    max_velocity: number,
    max_angular_acceleration: number,
    max_angular_velocity: number,
    mass: number
}

interface ShipState {

}

interface ShipInput {
    accelerate: boolean,
    brake: boolean,
    turn_left: boolean,
    turn_right: boolean
}

let debug_txt: Phaser.GameObjects.Text;

class Ship extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;
    spec: ShipSpecs;

    constructor(aParams: IImageConstructor, ship_specs: ShipSpecs) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        this.initSprite();
        this.initPhysics(ship_specs);
        this.scene.add.existing(this);
    }

    private initSprite() {
        this.setScale(0.8);
    }

    private initPhysics(ship_specs: ShipSpecs) {
        this.scene.physics.world.enable(this);
        this.body.setVelocity(0, 0);
        this.body.setCollideWorldBounds(true);
        this.body.setMaxSpeed(ship_specs.max_velocity);
    }

    handleInputs(ship_input: ShipInput, delta: number) {
        let angle = this.rotation;
        let x_rat = Math.sin(angle);
        let y_rat = -Math.cos(angle);
        if (ship_input.turn_left && !ship_input.turn_right) {
            this.body.setAngularAcceleration(-200)
        } else if (ship_input.turn_right && !ship_input.turn_left) {
            this.body.setAngularAcceleration(200);
        } else {
            this.body.setAngularAcceleration(0)
            this.body.setAngularVelocity(0)
        }
        if (ship_input.accelerate && !ship_input.brake) {
            this.setFrame("ship2.png")
            this.body.setAcceleration(x_rat * 20, y_rat * 20)
        } else if (ship_input.brake && !ship_input.accelerate) {
            this.setFrame("ship2.png")
            this.body.setAcceleration(-x_rat * 20, -y_rat * 20)
        } else {
            this.setFrame("ship.png")
            this.body.setAcceleration(0, 0)
        }
        debug_txt.setText(`Angle: ${angle}\nX: ${x_rat}\nY: ${y_rat}\nVelocity: ${this.body.speed}`)
    }
}


export class MainScene extends Phaser.Scene {
    private ship: Ship;
    private ts: Phaser.GameObjects.TileSprite;
    private camera: Phaser.Cameras.Scene2D.Camera;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({key: 'MainScene'});
    }

    preload(): void {
        this.load.atlas('ship', 'images/texture.png', 'images/texture.json');
        this.load.image('redParticle', 'images/red.png');
        this.load.image('bg', 'images/stars_bg.png')
    }

    create(): void {

        this.ship = new Ship({
            scene: this,
            x: 400,
            y: 300,
            texture: 'ship'
        }, {
            max_velocity: 200,
            max_acceleration: 10,
            max_angular_velocity: 10,
            max_angular_acceleration: 1,
            mass: 500
        });


        this.ts = this.add.tileSprite(600, 400, 1200, 800, "bg").setScrollFactor(0)
        debug_txt = this.add.text(0, 0, "test\ntest").setScrollFactor(0)
        this.camera = this.cameras.main;
        this.camera.startFollow(this.ship, false, 0.2, 0.2)
        // Set up the arrows to control the camera
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number) {
        this.ts.tilePositionX += 0.01 * this.ship.body.velocity.x * delta;
        this.ts.tilePositionY += 0.01 * this.ship.body.velocity.y * delta;

        this.ship.handleInputs({
            accelerate: this.cursors.up.isDown,
            brake: this.cursors.down.isDown,
            turn_left: this.cursors.left.isDown,
            turn_right: this.cursors.right.isDown
        }, delta)
    }
}
