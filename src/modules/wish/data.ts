import type { Wish } from './types';

export const wishes: Wish[] = [
  {
    owners: ['boy'],
    achived: true,
    desc: '考取软件设计师证书'
  },
  {
    owners: ['girl'],
    achived: true,
    desc: '升上 band 6'
  },
  {
    owners: ['boy'],
    achived: false,
    desc: '考取系统架构设计师证书'
  },
  {
    owners: ['girl'],
    achived: false,
    desc: '增强心理建设，减少内耗'
  },
  {
    owners: ['girl', 'boy'],
    achived: false,
    desc: '健身运动'
  }
];
