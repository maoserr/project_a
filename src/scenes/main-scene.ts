interface IImageConstructor {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string | Phaser.Textures.Texture;
    frame?: string | number;
}


class Ship extends Phaser.GameObjects.Image {
    body: Phaser.Physics.Arcade.Body;

    constructor(aParams: IImageConstructor) {
        super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

        this.initSprite();
        this.initPhysics();
        this.scene.add.existing(this);
    }

    private initSprite() {
        this.setScale(0.8);
    }

    private initPhysics() {
        this.scene.physics.world.enable(this);
        this.body.setVelocity(0, 0);
        this.body.setBounce(1, 1);
        this.body.setCollideWorldBounds(true);
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
        this.load.image('ship', 'images/ship.png');
        this.load.image('redParticle', 'images/red.png');
        this.load.image('bg', 'images/stars_bg.png')
    }

    create(): void {
        const particles = this.add.particles('redParticle');

        const emitter = particles.createEmitter({
            speed: 100,
            scale: {start: 0.5, end: 0},
            blendMode: 'ADD'
        });

        this.ship = new Ship({
            scene: this,
            x: 400,
            y: 300,
            texture: 'ship'
        });

        emitter.startFollow(this.ship);

        this.ts = this.add.tileSprite(600, 400, 1200, 800, "bg").setScrollFactor(0)

        this.camera = this.cameras.main;
        this.camera.startFollow(this.ship, false, 0.2, 0.2)
        // Set up the arrows to control the camera
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(time: number, delta: number) {
        this.ts.tilePositionX += 0.01 * this.ship.body.velocity.x * delta;
        this.ts.tilePositionY += 0.01 * this.ship.body.velocity.y * delta;
        if (this.cursors.left.isDown) {
            this.ship.body.setVelocityX(-10);
        } else if (this.cursors.right.isDown) {
            this.ship.body.setVelocityX(10);
        }
        if (this.cursors.up.isDown) {
            this.ship.body.setVelocityY(-10);
        } else if (this.cursors.down.isDown) {
            this.ship.body.setVelocityY(10);
        }
    }
}
