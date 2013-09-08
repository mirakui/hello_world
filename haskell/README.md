# Haskell
以下は学習メモのため、間違っている内容が含まれている可能性があります。

## 参考にしたサイト
- [Mac に Homebrew で Haskell 入れて HelloWorld - Qiita [キータ]](http://qiita.com/amay077/items/f2f7f1324ca5ea296dbb)
- http://tryhaskell.org/

## インストール
```
$ brew install ghc
$ ghci
GHCi, version 7.4.2: http://www.haskell.org/ghc/  :? for help
Loading package ghc-prim ... linking ... done.
Loading package integer-gmp ... linking ... done.
Loading package base ... linking ... done.
Prelude> putStrLn "hello, world"
hello, world
Prelude> :quit
Leaving GHCi.
```

## タプルとリスト
リストは要素の型が揃ってないとダメ、タプルは揃ってなくていいっていうよくあるやつ。

```haskell
-- リスト
[1,2,3]
-- タプル
(1, "foo")
-- いい
[(1, "foo"), (5, "bar")]
-- だめ
[(1, "foo"), (5, 6)]
```

### `:` 関数
左辺を右辺のリストの先頭に追加する。

```haskell
'a' : 'b' : []
=> "ab"

'a' : 'b' : "c"
=> "abc"
```

## 変数定義

```haskell
let x = 1 in x + x
=> 2
```

ruby で書くと多分こう

```ruby
(-> {
  x = 1
  x + x
})[]
=> 2
```

## 関数定義
let を使うと in スコープの中だけのローカル関数になるっぽい。

```haskell
let square x = x * x in square 5
=> 25
```

ruby に書き換えるとこういう感じだとおもう
```ruby
(-> {
  square = -> x {x * x}
  square[5]
})[]
=> 25
```

関数、ghci だと `let` 使わないと宣言できなかった。

## 中置記法
```haskell
1 > 5
=> False
```

は

```haskell
(>5) 1
=> False
```
とも書ける。これを利用して

```haskell
map (>5) [1..10]
=> [False,False,False,False,False,True,True,True,True,True]
```
とかできる。

以下は等価。

```haskell
1 > 5
=> False
(>) 1 5
=> False
(>5) 1
=> [1]
```

中置記法が使えるのは組み込みの特殊な関数だけっぽい？
`:` とか `>` とかは中置記法できるけど `map` とかはできなかった。

## 文字列
文字列 `""` は文字 `''` のリスト。

```haskell
"abc"
```
は

```haskell
['a', 'b', 'c']
```
のシンタックスシュガー。

```haskell
map toUpper "Chris"
=> "CHRIS"
```

## 引数のパターンマッチ
```haskell
let a:_:_:_ = "xyz" in a
=> 'x'
let (a:_) = "xyz" in a
=> 'x'
let foo@(a,b,c) = (10,20,30) in (foo,a,b,c)
=> ((10,20,30),10,20,30)
```

## 型
ghci で `:t` 使うと型が見える。

```haskell
Prelude> :t "abc"
"abc" :: [Char]
Prelude> :t (*)
(*) :: Num a => a -> a -> a
Prelude> :t drop 2
drop 2 :: [a] -> [a]
```

### lambda
```haskell
\x y z -> [x, y, z]
```

```ruby
->(x,y,z) { [x,y,z] }.curry
```
