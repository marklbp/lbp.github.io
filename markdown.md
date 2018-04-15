Markdown syntax quick start

#repeat n times means hn

#  h1
##  h2
####  h4

empty line display a paragraph, otherwise means in the same paragraph

[A](http://www.marklbp.com) display a link, [A] is your display text, (B) is the real link address 

![A](http://www.marklbp.com/images/chocolate.jpg) display a picture, ![A] is the description for this picture, (B) is ther real link of this picture

* unorder-list 1
* unorder-list 2
* unorder-list 3

1. order-list 1.
2. order-list 2.
3. order-list 3.

#### ```生成代码块


```
<div>   
    <div></div>
    <div></div>
    <div></div>
</div>
```

#### javascript代码块

```javascript
var num = 0;
for (var i = 0; i < 5; i++) {
    num+=i;
}
console.log(num);
```

#### 多层嵌套

> aaaaaaaaa
>> bbbbbbbbb
>>> cccccccccc