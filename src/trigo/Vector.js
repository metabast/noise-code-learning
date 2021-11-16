class Vector{
    constructor(x,y){
        this.x = x || 0;
        this.y = y || 0;
        this.isVector = true;
    }

    toString(){
        return `[x:${this.x}, y:${this.y}]`
    }


    length(){
        return Math.sqrt( Math.pow(this.x, 2) +  Math.pow(this.y, 2))
    }

    normalize(){
        return Vector.normalize(this)
    }

    angle(){
       // Same like Math.atan(this.y / this.x)
       return Vector.angle(this)
    }

    dot(vec){
        return Vector.dot(this, vec)
    }

    cross(vec){
        return Vector.cross(this, vec)
    }


    forward(dist){
        let newLength = this.length() + dist;
        let normalize = this.normalize();
        return new Vector( normalize.x * newLength, normalize.y * newLength )
    }

    rotate(angle){
        // this.getAngleInRadians() += 
    }

    multiply(v1){
        if(v1.isVector)
            return new Vector(this.x * v1.x, this.y * v1.y)
        else
            return new Vector(this.x * v1, this.y * v1)
    }
}

Vector.normalize = function(vec){
    if(vec.isVector){
        let ratio = 1/vec.length();
        return new Vector(vec.x * ratio, vec.y * ratio)
    }
    throw new Error('Vector.normalize accept only vector');
}

Vector.angle = function(vec){
    // Same like Math.atan(this.y / this.x)
   return Math.atan2(vec.y, vec.x)
}

Vector.dir = function(angleInRad){
    return new Vector( Math.cos(angleInRad), Math.sin(angleInRad) )
}

Vector.dot = function(v1, v2){
    if(v1.isVector && v2.isVector){
        return v1.x * v2.x + v1.y * v2.y;
    }
    throw new Error('Vector.dot accept only 2 vectors');
}

// Determinant
Vector.cross = function(v1, v2){
    if(v1.isVector && v2.isVector){
        return v1.x * v2.y - v1.y * v2.x;
    }
    throw new Error('Vector.cross accept only 2 vectors');
}

Vector.angleBetweenVectors = function(v1, v2){
    if(v1.isVector && v2.isVector){
        return Math.acos( Vector.dot(v1.normalize(), v2.normalize()) )
    }
    throw new Error('Vector.angleBetweenVectors accept only 2 vectors');
}

Vector.radToDeg = function(radian){
    return radian * Vector.RADEG
}

Vector.degToRad = function(degree){
    return degree / Vector.RADEG
}

Vector.lerp = function(v1, v2, t){
    return new Vector( (1-t) * v1.x + t * v2.x, (1-t) * v1.y + t * v2.y )
}

Vector.lerp2 = function(v1, v2, t){
    return new Vector( (1-t.x) * v1.x + t.x * v2.x, (1-t.y) * v1.y + t.y * v2.y )
}

Vector.clamp = function(v1, min=new Vector(), max=new Vector(1,1)){
    return new Vector( Math.min( max.x, Math.max( min.x, v1.x ) ), Math.min( max.y, Math.max( min.y, v1.y ) ) )
}

Vector.invLerp = function(v1, v2, v3){
    return Vector.clamp( new Vector( (v3.x-v1.x)/(v2.x-v1.x), (v3.y-v1.y)/(v2.y-v1.y) ) )
}

Vector.range = function(v1a, v1b, v2a, v2b, v3){
    return Vector.lerp2( v2a, v2b, Vector.invLerp(v1a, v1b, v3) )
}


Vector.RADEG = 180/Math.PI;
Vector.TAU = 2*Math.PI;
// RADEG * TAU = 360°

export default Vector;