/// 可分別指定及取出 RGB 數值的顏色物件
class RGBColor
{
    /// Red 值
    final int r;

    /// Green 值
    final int g;

    /// Blue 值
    final int b;

    /// 可分別指定及取出 RGB 數值的顏色物件
    const RGBColor({
        this.r,
        this.g,
        this.b
    });

    /// 將 RGBColor 物件轉為 JSON
    Map<dynamic, dynamic> toJson() => {
        'r': r,
        'g': g,
        'b': b
    };
}
