/** Gameインスタンス. */
var game;

/** UUID. */
var UUID = "b05ee512-40db-4c8e-88fe-863589533ee0";

var GAME_WIDTH = 320;
var GAME_HEIGHT = 320;

/** 可視範囲（垂直） */
var VIEWPORT = 4.5;

/** 可視範囲（水平） */
var VIEWPORT_H = 4.5;

/** ステージスクロール速度 */
var SCROLL_SPEED = 0.10;
/** ステージ旋回速度 */
var SCROLL_ROT_SPEED = 0.004;

/** アイテム（赤） */
var ITEM_RED = 0;

/** アイテム（青） */
var ITEM_BLUE = 1;

/** アイテム（黄） */
var ITEM_YELLOW = 2;

/** アイテム（白） */
var ITEM_SPEED = 3;

var MyGame = {
	/**
	 * 難易度(周回).
	 * 
	 * 1から数える
	 */
	level : 1,
	/**
	 * 毎フレームステージカウンタをインクリメントする
	 */
	stageStepUp : true,

	/**
	 * カメラ位置.
	 */
	camPos : null,
	/**
	 * カメラターゲット.
	 */
	camTar : null,

	/**
	 * サウンド再生環境あり
	 */
	soundEnable : false,
	/**
	 * BGM音量
	 */
	bgmVolume : 1.0,
	/**
	 * 効果音音量
	 */
	soundVolume : 0.3,

	/**
	 * ステージBGM
	 */
	bgm : null,
	/**
	 * ボスBGM
	 */
	bossBgm : null,
	/**
	 * 今流しているBGM
	 */
	currentBgm : null,

	/**
	 * 自機
	 */
	myship : null,

	/**
	 * 画面上にいる敵のリスト
	 */
	enemyList : null,

	/**
	 * 画面上にあるアイテムのリスト.
	 */
	itemList : null,

	/**
	 * 自機通常弾のプール
	 */
	bullets : null,
	/**
	 * 自機ボムのプール
	 */
	bombs : null,
	/**
	 * 自機ボム爆発のプール
	 */
	bombExps : null,

	/**
	 * 敵通常弾のプール(赤)
	 */
	enemyBullets : null,
	/**
	 * 敵通常弾のプール(緑)
	 */
	enemyBulletsG : null,
	/**
	 * 敵通常弾のプール(青)
	 */
	enemyBulletsB : null,
	/**
	 * 敵通常弾のプール(黄)
	 */
	enemyBulletsY : null,

	/**
	 * 敵のプール
	 */
	enemyPools : null,

	/**
	 * アイテム生成
	 */
	generateItem : null,

	/**
	 * 爆発
	 */
	explode : null,

	/**
	 * 演出シーン中フラグ
	 */
	performance : false,

	/**
	 * エフェクト用シェーダー
	 */
	effectShader : null,
	/**
	 * 背景用シェーダー
	 */
	backgroundShader : null
};
