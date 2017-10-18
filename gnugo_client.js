class Board {
    constructor(canvas, size) {
        this.size = size;
        this.canvas = canvas;
    }

    //      textBoard = '= \n' +
//          '   A B C D E F G H J K L M N O P Q R S T\n' +
//          '19 . . . . . . . . . . . . . . . . . . . 19\n' +
//          '18 . . . . . . . . . . . . . . . . . . . 18\n' +
//          '17 . . . . . . . . . . . . . . . . . . . 17\n' +
//          '16 . . . + . . . . . + . . . . . + . . . 16\n' +
//          '15 . . . . . . . . . . . . . . . . . . . 15\n' +
//          '14 . . . . . . . . . . . . . . . . . . . 14\n' +
//          '13 . . . . . . X . . . . . . . . . . . . 13\n' +
//          '12 . . . . . . . . . . . . . . . . . . . 12\n' +
//          '11 . . . . . . . . . . . . . . . . . . . 11     WHITE (O) has captured 0 stones\n' +
//          '10 . . . + . . . . . + . . . . . + . . . 10     BLACK (X) has captured 0 stones\n' +
//          ' 9 . . . . . . . . . . . . . . . . . . . 9\n' +
//          ' 8 . . . . . . . . . . . . . . . . . . . 8\n' +
//          ' 7 . . . . . . . . . . . . . . . . . . . 7\n' +
//          ' 6 . . . . . . . . . . . . . . . . . . . 6\n' +
//          ' 5 . . . . . . . . . . . . . . . . . . . 5\n' +
//          ' 4 . . . + . . . . . + . . . . . + . . . 4\n' +
//          ' 3 . . . . . . . . . . . . . . . . . . . 3\n' +
//          ' 2 . . . . . . . . . . O X . . . . . . . 2\n' +
//          ' 1 . . . . . . . . . X . . . . . . . . . 1\n' +
//          '   A B C D E F G H J K L M N O P Q R S T\n';
    genStoneList(textBoard) {
        var stoneList = [];
        for (var row of textBoard.split(/\n/)) {
            var array = row.trim().split(/\s+?/);
//                  if (array.length != 21) {
////                      console.log("row=" + row);
//                      continue;
//                  }
            var line = this.size - Number(array[0]);
            for (var i=0; i<array.length; i++) {
                if(/[\.+XO]/.test(array[i])) {
                    var pos = line * this.size + (i-1);
                    if (pos >= Math.pow(this.size, 2)) {
                        continue;
                    }
//                          console.log("line=" + line + ", " + pos + ", " + array[i]);
                    if (array[i] === 'X') {
                        stoneList[pos] = 1;
                    } else if (array[i] === 'O') {
                        stoneList[pos] = -1;
                    } else {
                        stoneList[pos] = 0;
                    }
                }
            }
        }
        return stoneList;
    }

    updateStoneList(stoneList) {
        this.stoneList = stoneList;
    }

    move(color, position) {
        console.log(position);
        if (position < 0 || position > Math.pow(this.size, 2)-1) {
            return -1;
        }
        this.stoneList[position] = color;
        return position;
    }

    position2Coordinate(position) {
        if (position < 0 || position > (Math.pow(this.size, 2)-1)) {
            return null;
        }
        var x = this.size - parseInt(position / this.size);
        var i = position % this.size;
        var y = String.fromCharCode(65 + (i < 9 ? i : (i + 1)) );
        return y + "" + x
    }

    computeMovePosition(x, y) {
        var canvasSize = this.computeCanvasSize();
        var offset = this.genBoardOffsetX(canvasSize);
        var unitSize = this.genBoardUnitSize(canvasSize, offset);

        if (x < parseInt(offset/2) || x > (unitSize*(this.size-1) + parseInt(offset*1.5))) {
            console.log("error x=" + x);
            return -1;
        }

        if (y < parseInt(offset/2) || y > (unitSize*(this.size-1) + parseInt(offset*1.5))) {
            console.log("error y=" + y);
            return -1;
        }

        var coorX = this.computeCoor(y, offset, unitSize);
        var coorY = this.computeCoor(x, offset, unitSize);

        if (coorX < 0 || coorY < 0) {
            return -1;
        }

        return coorX * this.size + coorY;
    }

    computeCoor(x, offset, unitSize) {
        var coorY = -1;
        var leftLine = -1;
        var rightLine = -1;
        for (var i=0; i<this.size+1; i++) {
            if (i === 0) {
                leftLine = parseInt(offset / 2);
                rightLine = offset;
                if (x >= leftLine && x < rightLine) {
                    coorY = 0;
                    break;
                }

            } else if (i === this.size) {
                leftLine = rightLine;
                rightLine = offset * 2 + unitSize * (this.size-1);
                if (x >= leftLine && x < rightLine) {
                    coorY = this.size - 1;
                    break;
                }

            } else {
                leftLine = rightLine;
                rightLine = offset + unitSize * i;
                if (x >= leftLine && x < rightLine) {
                    if (Math.abs(x-leftLine) - Math.abs(rightLine-x) <= 0) {
                        coorY = i - 1;
                    } else {
                        coorY = i;
                    }
                    break;
                }
            }
        }
        return coorY;
    }

    computeCanvasSize() {
        var canvasWidth;
        var width;
        if (screen.width > screen.height) {
            width = screen.height;
        } else {
            width = screen.width;
        }

        if (width > 500) {
            canvasWidth = 500;
        } else {
            canvasWidth = width;
        }
        return canvasWidth;
    }

    resetCanvasSize() {
        var canvasSize = this.computeCanvasSize();
        this.canvas.attr("width", canvasSize);
        this.canvas.attr("height", canvasSize);
    }

    genBoardUnitSize(canvasSize, offset) {
        return parseInt((canvasSize-offset*2) / (this.size-1));
    }

    genBoardOffsetX(canvasSize) {
        return parseInt(canvasSize / 15);
    }

    genBoardOffsetY(canvasSize) {
        return parseInt(canvasSize / 15);
    }

    draw() {
        var domCanvas = this.canvas.get(0);
        var context = domCanvas.getContext("2d");

        var canvasSize = this.computeCanvasSize();
        var offset = this.genBoardOffsetX(canvasSize);
        var boardOffsetX = offset;
        var boardOffsetY = offset;

        var unitSize = this.genBoardUnitSize(canvasSize, offset);
        var boardWidth = unitSize * (this.size-1);

        context.clearRect(0, 0, canvasSize, canvasSize);
        this.drawBoard(context, boardOffsetX, boardOffsetY, boardWidth, unitSize);
        this.drawStone(context, boardOffsetX, boardOffsetY, boardWidth, unitSize);
    }

    drawBoard(context, boardOffsetX, boardOffsetY, boardWidth, unitSize) {
        //draw background
//              context.fillStyle = "#00aa00";
//              context.fillRect(0, 0, canvasSize, canvasSize);

        //draw coor
        context.fillStyle = "#000000";
        for (var i=0; i<this.size; i++) {
            context.moveTo(boardOffsetX, boardOffsetY + i*unitSize);
            context.lineTo(boardOffsetX + boardWidth, boardOffsetY + i*unitSize);
        }

        for (var j=0; j<this.size; j++) {
            context.moveTo(boardOffsetX + j*unitSize, boardOffsetY);
            context.lineTo(boardOffsetX + j*unitSize, boardOffsetY + boardWidth);
        }
        context.stroke();

        //draw star
        if (this.size >= 19) {
            var r = parseInt(unitSize/6);
            var sAngle = 0 * Math.PI;
            var eAngle = 2 * Math.PI;

            context.beginPath();
            context.arc(boardOffsetX+3*unitSize, boardOffsetY+3*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+3*unitSize, boardOffsetY+parseInt(this.size/2)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+3*unitSize, boardOffsetY+(this.size-4)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+parseInt(this.size/2)*unitSize, boardOffsetY+3*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+parseInt(this.size/2)*unitSize, boardOffsetY+parseInt(this.size/2)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+parseInt(this.size/2)*unitSize, boardOffsetY+(this.size-4)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+(this.size-4)*unitSize, boardOffsetY+3*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+(this.size-4)*unitSize, boardOffsetY+parseInt(this.size/2)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

            context.beginPath();
            context.arc(boardOffsetX+(this.size-4)*unitSize, boardOffsetY+(this.size-4)*unitSize, r, sAngle, eAngle);
            context.closePath();
            context.fill();

        }

        //draw X,Y
        context.fillStyle = "#000000";
        for (var i=0; i<this.size; i++) {
            context.fillText(""+(this.size-i), boardOffsetX-15, boardOffsetY + i*unitSize);
            context.fillText(String.fromCharCode(65+(i<9?i:(i+1))), boardOffsetX + i*unitSize, boardOffsetY-10);
        }
        context.stroke();

    }

    drawStone(context, boardOffsetX, boardOffsetY, boardWidth, unitSize) {
        console.log("stonelist=" + this.stoneList.length);
        var r = parseInt(unitSize/2.1);
        var sAngle = 0 * Math.PI;
        var eAngle = 2 * Math.PI;
        for (var i=0; i<this.stoneList.length; i++) {
            var stone = this.stoneList[i];
            if (stone == 1) {
                context.fillStyle = "#000000";
            } else if (stone == -1) {
                context.fillStyle = "#ffffff";
            } else {
                continue;
            }
            var x = boardOffsetX + (i % this.size) * unitSize;
            var y = boardOffsetY + parseInt(i/this.size) * unitSize;
            context.beginPath();
            context.arc(x, y, r, sAngle, eAngle);
            context.closePath();
            context.fill();
        }

    }
}

class GtpClient {
    constructor(host, port) {
        this.host = host;
        this.port = port;
        /*
          0:init
          1:sent
         */
        this.response = '';
    }

    connect(onResponse) {
        this.ws = new WebSocket("ws://" + this.host + ":" + this.port +"/");
        this.ws.onopen = function(event) {
            console.log("Connection open ..." +  + event.data);
        };

        this.ws.onmessage = function(event) {
//                  console.log("Received Message: " + event.data + ", " + event.data.length);
            if (this.response === undefined) {
                this.response = event.data;
            } else {
                this.response += event.data + "\n";
            }
            if (event.data.length === 0) {
                onResponse(this.response);
                this.response = "";
            }
        };

        this.ws.onclose = function(event) {
            console.log("Connection closed." + event.data);
        };

        this.ws.onerror = function (event) {
            console.log("Connection error." + event.data);
        }

    }

    getSocketState() {
        return this.ws.readyState;
    }

    getStateText() {
        var result = "Unknow";
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                result = "Connecting...";
                break;
            case WebSocket.OPEN:
                result = "Connented";
                break;
            case WebSocket.CLOSING:
                result = "Closing...";
                break;
            case WebSocket.CLOSED:
                result = "Closed";
                break;
            default:
                break;
        }
        return result;
    }

    estimateScore() {
        var message = "estimate_score";
        this.sendMessage(message);
    }

    genmove(color) {
        var message = "genmove " + (color === 1 ? "black" : "white");
        this.sendMessage(message);
    }

    sendMove(xy) {
        var message = "play black " + xy;
        this.sendMessage(message);
    }

    sendMessage(message) {
        if (this.ws.readyState != WebSocket.OPEN) {
            console.log("ws state=" + this.ws.readyState);
            return;
        }

        console.log("-------ws send=" + message);
        this.ws.send(message);
    }
}