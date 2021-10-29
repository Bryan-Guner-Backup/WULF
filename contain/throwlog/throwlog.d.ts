interface ThrowLogConfig{
	defaltLog?:(any) => any;
	defaltError?:(any) => any;
}

export function throwLogConfig(conf: ThrowLogConfig): void;

export function dump(data: any): void;

export function dump_(data: any, logTo?: (any)=>any): void;

export function error(msg: any): void;

export function error_(msg: any, logTo?: (any)=>any): void;

export function info(msg: any): void;

export function info_(msg: any, logTo?: (any)=>any): void;

export function success(msg: any): void;

export function success_(msg: any, logTo?: (any)=>any): void;

export function warn(msg: any): void;

export function warn_(msg: any, log?: (any)=>any): void;

export function kill(data: any, headline?: any): void;


