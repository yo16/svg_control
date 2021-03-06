# svg_control
- SVG要素を作ったりドラッグしたり早くしたりする試行錯誤。
- 基本的に、htmlファイルをブラウザにドロップすれば動く。

## SVG仕様
https://triple-underscore.github.io/SVG11/

## 概要
- 20210121_draw_sample
    - 線要素をJavaScriptで生成するサンプル。
        - line要素はjQueryでは生成できない。できるけど無視される。
        - `document.createElementNS("http://www.w3.org/2000/svg", "line")` で生成する。
        - 位置(x,y)とか線太さの属性もjQueryで入れると無視される。
        - 属性は `setAttribute` で入れる。
- 20210121_pos_direction
    - 原点とXY軸の方向を調べる。
        - 原点は左上。
        - X軸プラス方向は右、Y軸プラス方向は下。（手前がZ方向プラスとすると、左手系）
- 20210122_click_svg
    - クリックイベントと座標を取得。
        - クリックイベントのoffsetX、offsetYを使うと、SVGの左上からの座標になる。
        - pageX,Yは、スクロールしても値が変わらない真のページ左上が(0,0)の座標値。
        - clientX,Yは、スクロールした時点の左上が(0,0)の座標値。
        - 重なっている要素のクリックイベントは、タグ的に上へ伝播する。絵的に重なっていてもタグが兄弟だったら無関係という意味。
- 20210122_drag
    - SVG要素のドラッグサンプル
        - mousedown、mouseup、mousemoveに仕込む。
- 20210123_1_transform_matrix
    - transformタグを使って、位置と形状を変更するサンプル
        - `transform="matrix(2,0,0,1,100,100)"` で、(a11,a21, a12,a22, a13,a32)の行列演算をかけた状態。
            - x軸方向に２倍
            - y軸方向は変更なし（１倍）
            - そのあと、
            - (100,100)移動
- 20210123_2_transform_click
    - Matrixで変形した後、クリックイベントの値がどうなるか確認
        - 変形後の座標値の値を得られる。
- 20210123_3_g_elm_click
    - g要素をクリックするとどうなるか
        - g要素は、クリックされるものを持たないので、イベントが発生しない。
        - ただし、g要素の中にあるたとえばrect要素をクリックされると、上に伝播してg要素のクリックイベントも動く。
            - 伝播については、 `20210122_click_svg` 。
    - g要素をtransformするとどうなるか
        - 中に入っている要素全てが、一気にtransformされる。
- 20210123_4_clicked_point
    - クリックした位置に円と座標値を描くサンプル
    - 今後も使いそうなので作っておいた。
- 20210123_5_drag_transform
    - ドラッグで要素全部を移動するサンプル
        - "要素全部"は、g要素で認識するが、g要素はマウスイベントを認識できない。
        - なのでマウスイベントは全体のSVGで認識し、g要素を変形するようにした。
        - もっといいやりかたがあるのかもしれない。
- 20210123_6_global_settings
    - 線幅とかをまとめて変更する方法のサンプル
        - g要素に `stroke-width` とかを設定すると、子はそれを使う。
        - g要素内の子にも指定されている場合は、子の指定が優先される。
- 20210203_1_draggable_elm_class
    - ドラッグ可能な要素クラスのサンプル
        - svg要素のクラスと、ドラッグする対象(サンプルではrect)のクラスで実現してみた。
- 20210204_1_draggable_with_inertia_elm_class
    - ドラッグ＆ドロップで慣性を持っているように動作させるサンプル。
    - 正直動きは微妙。必要になったらもうちょっと原因調査が必要。
- 20210206_1_draggable_with_grid_elm_class
    - ドラッグしてグリッドに寄せるサンプル

