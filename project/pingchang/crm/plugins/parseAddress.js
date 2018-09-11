import Address from '@/config/address.config.js';

export default function(pId, cId, aId){
	if(!pId)return ['','','']
	let p = Address["100000"][pId];
	let c, a;
	if(Address[pId] && cId){
		c = Address[pId][cId];
	}
	if(Address[cId] && aId){
		a = Address[cId][aId];
	}
  c = c ? c : '';
  a = a ? a : '';
	return [p,c,a]
}