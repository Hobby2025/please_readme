import React from 'react';
import { Profile, GitHubStats, ProfileCardProps } from '../../types/profile';
// TechBadge를 직접 정의해서 사용합니다
// import { TechBadge } from '../ui/TechBadge';

// 단순화된 TechBadge 컴포넌트 (Static 이미지용)
const SimpleTechBadge = ({ tech }: { tech: string }) => {
  // 색상과 배경색 기본값 지정
  const bgColors: Record<string, string> = {
    // 배경색 맵핑
    'React': '#61DAFB',
    'TypeScript': '#3178C6',
    'JavaScript': '#F7DF1E',
    'Next.js': '#000000',
    'Node.js': '#339933',
    'Python': '#3776AB',
    'Java': '#007396',
    'Go': '#00ADD8',
    'CSS3': '#1572B6',
    'HTML5': '#E34F26',
    'Tailwind CSS': '#06B6D4',
    'MySQL': '#4479A1',
    'PostgreSQL': '#4169E1',
    'MongoDB': '#47A248',
    'Express': '#000000',
    'GraphQL': '#E10098',
    'Redux': '#764ABC',
    'Git': '#F05032',
    'Docker': '#2496ED',
    'Kubernetes': '#326CE5',
    'AWS': '#232F3E',
    'Flutter': '#02569B',
    'Vue.js': '#4FC08D',
    'Angular': '#DD0031',
    'default': '#6B7280'  // 기본 회색
  };
  
  // 텍스트 색상 결정
  const textColors: Record<string, string> = {
    'JavaScript': '#000000',  // 밝은 배경은 검은색 텍스트
    'default': '#FFFFFF'      // 대부분은 흰색 텍스트
  };
  
  // 아이콘 URL 맵핑
  const iconUrls: Record<string, string> = {
    'React': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+JiN4YTsgIDx0aXRsZT5SZWFjdCBMb2dvPC90aXRsZT4mI3hhOyAgPGNpcmNsZSBjeD0iMCIgY3k9IjAiIHI9IjIuMDUiIGZpbGw9IiM2MWRhZmIiLz4mI3hhOyAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPiYjeGE7ICAgIDxlbGxpcHNlIHJ4PSIxMSIgcnk9IjQuMiIvPiYjeGE7ICAgIDxlbGxpcHNlIHJ4PSIxMSIgcnk9IjQuMiIgdHJhbnNmb3JtPSJyb3RhdGUoNjApIi8+JiN4YTsgICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+JiN4YTsgIDwvZz4mI3hhOzwvc3ZnPg==',
    'TypeScript': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2ZmZiI+JiN4YTsgIDxwYXRoIGQ9Ik0xLjEyNSAwQy41MDQgMCAwIC41MDQgMCAxLjEyNXYyMS43NUMwIDIzLjQ5Ni41MDQgMjQgMS4xMjUgMjRoMjEuNzVjLjYyMSAwIDEuMTI1LS41MDQgMS4xMjUtMS4xMjVWMS4xMjVDMjQgLjUwNCAyMy40OTYgMCAyMi44NzUgMGgtMjEuNzV6TTEyLjMwNSA4LjAyNGg0LjEzOXYxLjA5N2gtMi45MnY4LjQ2M2gtMS4yMjVWOS4xMTloLTIuOTI3VjguMDI0ek0xNy41IDEwLjc2N2MwLS41OTctLjEzOC0xLjA4Mi0uNDExLTEuNDYtLjI5NS0uMzc4LS43MTUtLjU2Ni0xLjI2LS41NjYtLjM4MSAwLS43MjMuMDk1LTEuMDI1LjI4NS0uMy4xOS0uNTI4LjQ2Mi0uNjg0LjgxOGgtLjAyOGMtLjE0My0uMzUxLS4zNjMtLjYyMS0uNjYxLS44MTgtLjI5Ny0uMTktLjYzNi0uMjg5LTEuMDE3LS4yODUtLjM1OCAwLS42NjQuMDg2LS45MTguMjU5LS4yNjguMTktLjQ3Mi40NjctLjYxLjgyOGgtLjAyOFY4Ljg1MmgtMS4xMzN2Ny4xMjloMS4xMjV2LTMuNjk1YzAtLjQ4LjEwMi0uODUyLjMwNy0xLjExNS4yMDUtLjI2NS41MTEtLjM5Ni45MTktLjM5Ni4zODkgMCAuNjcxLjEyLjg1NC4zNTYuMTgyLjIzOC4yNzQuNTk0LjI3NCAxLjA2OXYzLjc4MWgxLjEzM3YtMy44NjljMC0uNDU1LjEwMi0uODA4LjMwNi0xLjA1NnMuNTEtLjM3Mi45MTgtLjM3MmMuMzg5IDAgLjY3Mi4xMTcuODU3LjM0Ny4xOS4yMy4yODIuNTc4LjI4MiAxLjA0NHYzLjkwNmgxLjEzNHYtNC4yM2MwLS42MzgtLjE1My0xLjExOS0uNDYxLTEuNDQxLS4zMDMtLjMyNC0uNzQ4LS40ODUtMS4zMzgtLjQ4NS0uNDE0IDAtLjc3OS4wOTItMS4wOTcuMjc4LS4zMTQuMTg3LS41NC40NTgtLjY3NS44MTRoLS4wNDFjLS4xNTMtLjM0OS0uMzgtLjYxNy0uNjgtLjgwNy0uMy0uMTktLjY1NS0uMjg1LTEuMDY3LS4yODV6IiBmaWxsPSIjMzE3OEM2Ii8+JiN4YTs8L3N2Zz4=',
    'JavaScript': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48c3R5bGU+LmF7ZmlsbDojZjdkZjFlO308L3N0eWxlPjwvZGVmcz48cGF0aCBjbGFzcz0iYSIgZD0iTTAsMGgxMDB2MTAwSDBWMFptOTAuNzEsNzcuNzljMi4zOC0xLjU2LDUuMS00LjQ0LDcuMDctOC4xMWwtOC42NS01LjYzYy0xLjA4LDEuOTMtMi41NCwzLjktNS4wOCwzLjktMi43NiwwLTQuNDQtMS41My01LjY0LTQuNThMNzgsNjQuODRjLTIuOTMsMy4yNi04LjY2LDcuNDgtMTYuODcsNy40OC0xMC4zMSwwLTE1LjkzLTUuOS0xNS45My0xNC41MiwwLTguMTcsNi4yOC0xNC4zMSwxNS44Mi0xNC4zMSwxLjM0LDAsMi4zMS4xMywzLjM4LjI3VjI3LjU4aDkuMTF2MjQuMTNjMCw4LjkzLDQuMDcsMTIuMTksOC4yOCwxMi4xOSwyLjc2LDAsNC4zLTEuMyw1LjI1LTIuODZsMS4xMy0xLjg4VjQzLjgxaDkuMjR2MjcuNjlDOTcuNDEsNzMuNzgsOTQuNzksNzYuMDksOTAuNzEsNzcuNzlaTTY0LjQsNDguMTJhMTYsMTYsMCwwLDAtMy0uMjdjLTUuNzcsMC03LjQ4LDQuNzEtNy40OCw4LjY2czIuMiw4LjM5LDcuMDcsOC4zOWMzLjM5LDAsNi0yLjYsNi02LjgzVjQ4LjEyWk0zOS43OCw3Mi4zMmMtMS44OCwwLTYuMjgtLjI3LTkuOTMtMS44OWw0LjQzLTguNjVjMi41OSwxLjA4LDUuMjMsMS44OSw3LDEuODlzMy01MC4zMi0uODEtMSwyLjA1LDEuNzcsMi4wNSwyLjg2YzAsMS4yMi0uNzYsNS0zLjI2LDUuNzZaTTE2LjE0LDg1LjEybDQuNDMtOUMyMSw3Ni4zOCwyMy4zNSw3NywyNC41Nyw3N2MyLjg1LDAsNC44NC0xLjA3LDQuODQtNS42M1Y0My44MWg5LjI0VjcxLjc3YzAsMTAuMTgtNS44OSwxNC44NC0xNi4zMywxNC44NEMxOS40Myw4Ni42MSwxNy44MSw4Ni4wNywxNi4xNCw4NS4xMloiLz48L3N2Zz4=',
    'Node.js': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjI0IDUwOGMtNi43IDAtMTMuNS0xLjgtMTkuNC01LjJsLTYxLjctMzYuNWMtOS4yLTUuMi00LjctNy0xLjctOGMxMi4zLTQuMyAxNC44LTUuMiAyNy45LTEyLjdjMS40LS44IDMuMi0uNSA0LjYuNGw0Ny40IDI4LjFjMS43IDEgNC4xIDEgNS43IDBsMTg0LjctMTA2LjdjMS43LTEgMi44LTMgMi44LTVWMTQ4LjljMC0yLTEuMS00LTIuOS01TDIyOS41IDM3LjNjLTEuNy0xLTQtMS00LjYgMEw0MC4yIDE0My44Yy0xLjcgMS0yLjkgMy0yLjkgNVYzNThjMCAyIDEuMSA0IDIuOSA0LjlsNTAuNiAyOS40YzI3LjUgMTMuNyA0NC4zLTIuNCA0NC4zLTE4LjdWMTY3LjVjMC0zIDIuNC01LjMgNS4zLTUuM2gyMy45YzIuOSAwIDUuMyAyLjMgNS4zIDUuM1YzNDRjMCAzNi42LTE5LjkgNTcuNi01NC43IDU3LjYtMTAuNyAwLTE5LjEgMC00Mi41LTExLjZsLTQ4LjQtMjhjLTExLjktNi45LTE5LjQtMTkuOS0xOS40LTMzLjhWMTQ5YzAtMTMuOSA3LjQtMjYuOSAxOS40LTMzLjhMMjA0LjYgNy4zYzExLjctNi42IDI3LjItNi42IDM4LjggMGwxODQuNyAxMDYuN2MxMiA2LjkgMTkuNCAxOS44IDE5LjQgMzMuOHYyMTNjMCAxMy45LTcuNCAyNi45LTE5LjQgMzMuOEwyNDMuNCA1MDIuOGMtNS45IDMuNC0xMi42IDUuMi0xOS40IDUuMnptMTQ5LjEtMjEwLjFjMC0zOS45LTI3LTUwLjUtODMuNy01OC0xNy43LTIuMy03OS42LTE2LTc5LjYtNzIgMC00LjYgMC04MS44IDY5LjUtODEuOCAxNDEuMSAwIDEyNC42IDE3Ni44IDEyNC42IDE3Ni44aC0zMS4xcy00LjktNzMuOS01NC41LTczLjljLTI0LjIgMC0zNy42IDEwLjgtMzcuNiAzMi4zIDAgMzQgMzkuMiAzOS44IDcyLjYgNDMuOCA1OC4zIDcgODguOSAyNi44IDg4LjkgODQuMSAwIDIyLjMtMi41IDEwNy4zLTgzLjIgMTA3LjMtODIuMiAwLTEyNC4zLTM1LjEtMTI0LjMtOTUuMnoiLz48L3N2Zz4=',
    'Python': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNNDM5LjggMjAwLjVjLTcuNy0zMC45LTIyLjMtNTQuMi01My00NC45LTIwLjMgNi4xLTQxLjkgOS4yLTY0LjUgOS4yaC0zNy42VjEyMS4yYzAtMjguMi0yMi45LTUwLjktNTEuMi01MC45SDk0LjdDNjYuNSA3MC4zIDQ1LjEgOTIuOSA0NS4xIDEyMS4ydjM2Ljk0MiBjNDYuOTU5LTM3Ljk3NyAxMTcuMzg0LTM2LjAyOSAxNjIuNjM4LjI3IDguNDggNi44MiAxMy4yNSAxNi4zMjQgMTMuMjUgMjYuNzA4djM2Ljg4SEw4Mi40LjYyMmMtMjUuMi0uMy00NS43IDE5LjctNDUuNyA0NS4xdjIyNS4xYzAgMjQuNSAxOS44IDQ1LjQgNDUuNyA0NS40aDE5Mi45di0yNS44YzAtMTkuNCA5LTMzIDE4LjgtNDAuNSAxMC41LTcuOCAyNC4xLTEyLjIgMzguOC0xMi4yaDE2LjF2LTQxLjNjMC0yOC02LjgtNTYuNC0yMC41LTc5LTItMy40LTUuNC02LjYtOS43LTEwLjMgNDEuMSAxNS42IDY1LjggMzcgNzkuOSA1Ni43IDE0LjQgMTkuOSAyOC44IDQ2LjcgMjguOCA5MC42djExLjljMCAxOS44IDIuNCAzNi40IDkuMiA1MC40IDguNSAxNy44IDIyLjEgMjcuOCAzOS44IDI3LjggMTYgMCAzNS4xLS45IDU3LjUtOS40IDQxLjEtMTUuNiAzMS42LTQwLjI0IDMxLjYtMTA1LjI0di0xMjQuMXptLTI1My45IDEwNi45aC03Ni44Yy04LjIgMC0xNC4yLTUuOS0xNC4yLTEzLjh2LTY2YzAtOC4xIDYuNC0xMy44IDE0LjItMTMuOGg3Ni44YzcuOCAwIDE0LjIgNi4yIDE0LjIgMTMuOHY2NmMwIDcuOS02LjQgMTMuOC0xNC4yIDEzLjh6bTMwMi41LTEzLjh2LTY2YzAtOC4xLTYuNi0xMy44LTE0LjQtMTMuOGgtNzYuOGMtOC4yIDAtMTQuNCA1LjktMTQuNCAxMy44djY2YzAgNy45IDYuNiAxMy44IDE0LjQgMTMuOGg3Ni44czE0LjQtNiAxNC40LTEzLjh6Ii8+PC9zdmc+',
    'HTML5': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCA1MDBMNZC03NiA1MTJIMzI4bDM2LTM3NkwzODQgNTBIMHpNMzA4LjIgMjIzLjhsMi4yIDI0SDIzNmw0LjQgNTEuNyA0OS45IDEzLjcgNDkuNC0xMy43IDMuNC0zOC4zSDM1MmwtNi42IDc1LjhtLTk2LjkgNzUuNy0uOC4yLTQ1LjQtMTIuNUwxNjQgMzMyLjRoLTM5LjZsNC44IDUxLjYgNzUuMSAyMC44LjkuM3YtNjF6TTExNiAyMTYuOWg1M2wtNC4yLTQ2LjFINTE2bDQuNCAxNi4xaDM2LjhsLTguOS0xMDFINVztbtOF8zMjcuNWwxLjctMTlIMjczdjM2LjJ6Ii8+PC9zdmc+',
    'CSS3': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMCA1MDBMZC03NiA1MTJIMzI4bDM2LTM3NkwzODQgNTBIMHpNMzEzLjEgMTI3LjdsLTQuOCA1MC43aC0xMzYuM3YuMWgtNjcuNmwzLjEgMzMuN2g2NC41aDE2LjF2LjFoODRsLTUuNyA1OS40LTM1LjkgOS45LTQwLjUtMTAuOS0yLjYtMjkuMWgtMzJsNS4xIDU3LjggNzAuMSAxOS44IDcwLjEtMTkuOCA5LjEtMTAxLjNoLTE2Ni4xdi0uMWgtMi4xbDMuMSAzNC43aDk4LjFoMi4xdi0uMWg5M2wzLjEtMzUuNy04LTg4LjloLTIxOC45bDktNTEuN2gyOTguN3oiLz48L3N2Zz4=',
    'Java': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzODQgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMTI3LjYgNTEyYzE0MC4zLTM2LjEgOTYuNy0xOTkuNCAxODQuMy0xNzMuNSA4Ni43IDI1LjUtNDEuOSAxNjMuMiA0OCAxOTgtNC4zIDExLTQgMjQuNi0zNy40IDI0LjZIMTI3LjZ6TTY3LjEgNDM2LjljMjYuMSA1LjkgNDUuOS04LjggNTcuOC0yNS42IDExLjYtMTYuNCAxMS45LTQwLjgaI8+PC9zdmc+',
    'Go': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjU1IDM5NC44YTM2LjggMzYuOCAwIDAgMC0zNi44IDM2LjlBMzYuOCAzNi44IDAgMCAwIDI1NSA0NjguNWEzNi44IDM2LjggMCAwIDAgMzYuOC0zNi44YzAtMjAuNC0xNi40LTM2LjktMzYuOC0zNi45em0yMDYuNi0xMTUuNmM2LjIgMCAxMi40LTEuNyAxx\UcxC0zLjYtMjEuNS0xLC0zMi44LTYuMS02OC40LTMxLjktOTYuNyA2NS45LTEzMy41IDEwNy43LTE1NC44LTYxLjItNDYuMjYgNTkuMS04NC4yOSAxNTIuOCAzNi4dDctMTMyLjEtNjcuMjdhNDMuNiA0My42IDAgMCAwLTI4LjMtMjMuOS0xMDEgMTAxIDAgMCAwLTkyLjUgMTguMWMtNzEuNSA0NS44LTY5LjUgMTIzLTg5IhtJSuMTc3LjQgMjM5LjYgMjcyLjUgMjc2LjQgMjI5LjggMC0uMSAwLS4xIDAtLjEtNjQgNDIuMi0xMS41IDEwOCA1MC40IDEwOC45IDUzLjYuOCA5OC44LTI4LjEgMTcxLjctOS44IDU5LjggMTUgODEuNSA2Ny40IDExMC4yIDUwLjggMjEuOC0xMi41IDEwLjItNzAtNTAtMTIxLjEgNDUuNi00My41IDk3LjgtMzEuNSAxMjAuOC0xNS41IDE5LjIgMTMuNCAxNS42IDQzLjgtMTAuNiA1MS42eiIvPjwvc3ZnPg==',
    'Next.js': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDkgMjI4Ij48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjA0LjggMjA0LjhjMTMuOS0uMSAyNC40LTQuNCXNjMDEuMS0zOS43LTU1LjgtODAuOS0xMDMtMTkuNS0zMC40IDM5LjMtNTUuMyA3NC40LTcwLjkgMTA1SDAsN2M0LTExIDguMS0yMS42IDEyLjgtMzEuNyAxNC41LTMwLjQgMzkuNC01NS44IDY0LTkyLjUtMy00LjYtNy4yLTkuNy0xMC40LTEzLjYtMTAuOC0xMy4xLTE5LjgtMjQuOC0yNi45LTM2LjhoMTQwLjl2LS4xYzAgMi41IDEzLjQuNSAxNSAwaC44MXoiLz48cGF0aCBmaWxsPSIjZmZmIiBkPSJNMjcxLjkgMi45YzQ5LjMgNTguOCAyNC4xIDE0NS4zLTMzLjggMTkxLjYtMTkuNyAxNS45LTQyLjQgMjguOS02NS43IDE1LjgtMjIuMy0xMi4yLTMwLjgtNDAuOC0yOC4xLTY5LjYgMy41LTM2LjMgMjkuMS02Ny41IDUyLjEtOTEuNyAyNi4xLTI3LjIgNTMuNi00OS4xXSucy0xOS4xLS44MS01MS43IDguNXYtNzIuMmMxNS40LTcuMSAzMC44LTEyLjUgNDcuNy0xMi41IDMxLjggMCA1NiAxNy40IDc5LjUgNDIuN3ptLTE5OS4xIDk4LjhWNDYuM2wxMDcuNiAxNTYuMmMtMTQuOC00LjgtMjcuOS0xNS41LTM2Ljx2Ny0yNi4xYy0xMC41LTI3LjQtMTAuOC01Mi4xLTIuOS03Ni4yLTIwLjQgMTcuNi0zNS44IDQyLjEtND0uNC42Ni44Tjwvc3ZnPg==',
    'Tailwind CSS': 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTkgNkMzIDYgMiAxMiAyIDE0LjV2LjVjMCAxLjUtLjUgMi41LTIgM3YxYzEuNS41IDIgMS41IDIgM3YuNWMwIDIuNSAxIDguNSA3IDguNXY0YzAgMCAzLS41IDMtM1YyNGMwLTIuNS0xLTctOC03bDQtLjVDOCAxMSA2IDYgNiA2aDN6TTIzIDZjNiAwIDcgNiA3IDguNXYuNWMwIDEuNS41IDIuNSAyIDN2MWMtMS41LjUtMiAxLjUtMiAzdi41YzAgMi41LTEgOC41LTcgOC41di00YzAgMC0zLS41LTMtM1Y4YzAtMi41IDEtNyA4LTdsLTQuNS41QzIzIDE2IDI2IDYgMjYgNmgtM3oiLz48L3N2Zz4=',
  };
  
  const bgColor = bgColors[tech] || bgColors['default'];
  const textColor = textColors[tech] || textColors['default'];
  const iconUrl = iconUrls[tech] || '';

  return (
    <span
      className="inline-block px-2 py-1 rounded-full text-xs font-medium"
      style={{ 
        backgroundColor: bgColor,
        color: textColor,
        padding: '4px 8px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '500',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {iconUrl && (
        <img 
          src={iconUrl} 
          alt={`${tech} 아이콘`} 
          style={{ 
            width: '14px', 
            height: '14px',
            display: 'inline-block',
            verticalAlign: 'middle'
          }} 
        />
      )}
      {tech}
    </span>
  );
};

// 랭크별 전체 디자인 요소 모음 (색상, 배경, 효과 등)
const rankDesignSystem: Record<string, {
  border: string;         // 테두리 스타일
  background: string;     // 배경 스타일 (그라데이션 등)
  textColor: string;      // 랭크 텍스트 색상
  glow: string;           // 외부 발광 효과
  badge: string;          // 배지 스타일
  shadow: string;         // 그림자 효과
  statsBg: string;        // 통계 항목 배경
}> = {
  'S': {
    border: 'border-purple-500 dark:border-purple-400',
    background: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)] dark:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    badge: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white',
    shadow: 'shadow-lg shadow-purple-200 dark:shadow-purple-900/30',
    statsBg: 'bg-purple-50 dark:bg-purple-900/20',
  },
  'A+': {
    border: 'border-blue-500 dark:border-blue-400',
    background: 'bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-blue-800/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.4)] dark:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    badge: 'bg-gradient-to-r from-blue-500 to-sky-500 text-white',
    shadow: 'shadow-lg shadow-blue-200 dark:shadow-blue-900/30',
    statsBg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  'A': {
    border: 'border-blue-400 dark:border-blue-300',
    background: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10',
    textColor: 'text-blue-500 dark:text-blue-300',
    glow: 'shadow-[0_0_8px_rgba(59,130,246,0.3)] dark:shadow-[0_0_12px_rgba(59,130,246,0.2)]',
    badge: 'bg-blue-500 text-white',
    shadow: 'shadow-md shadow-blue-100 dark:shadow-blue-900/20',
    statsBg: 'bg-blue-50/80 dark:bg-blue-900/10',
  },
  'A-': {
    border: 'border-sky-400 dark:border-sky-300',
    background: 'bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/10',
    textColor: 'text-sky-500 dark:text-sky-300',
    glow: 'shadow-[0_0_6px_rgba(14,165,233,0.3)] dark:shadow-[0_0_10px_rgba(14,165,233,0.2)]',
    badge: 'bg-sky-500 text-white',
    shadow: 'shadow-md shadow-sky-100 dark:shadow-sky-900/20',
    statsBg: 'bg-sky-50/80 dark:bg-sky-900/10',
  },
  'B+': {
    border: 'border-green-500 dark:border-green-400',
    background: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10',
    textColor: 'text-green-500 dark:text-green-400',
    glow: '',
    badge: 'bg-green-500 text-white',
    shadow: 'shadow-md shadow-green-100 dark:shadow-green-900/20',
    statsBg: 'bg-green-50/80 dark:bg-green-900/10',
  },
  'B': {
    border: 'border-green-400 dark:border-green-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-green-500 dark:text-green-300',
    glow: '',
    badge: 'bg-green-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'B-': {
    border: 'border-lime-400 dark:border-lime-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-lime-500 dark:text-lime-300',
    glow: '',
    badge: 'bg-lime-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'C+': {
    border: 'border-yellow-400 dark:border-yellow-300',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-yellow-500 dark:text-yellow-300',
    glow: '',
    badge: 'bg-yellow-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  'C': {
    border: 'border-yellow-300 dark:border-yellow-200',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-yellow-400 dark:text-yellow-200',
    glow: '',
    badge: 'bg-yellow-300 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
  '?': {
    border: 'border-gray-200 dark:border-gray-700',
    background: 'bg-white dark:bg-gray-800',
    textColor: 'text-gray-500 dark:text-gray-400',
    glow: '',
    badge: 'bg-gray-400 text-white',
    shadow: 'shadow-md',
    statsBg: 'bg-gray-50 dark:bg-gray-700/50',
  },
};

// ProfileCardStatic 컴포넌트: Next.js Image 태그 대신 img 태그 사용
export default function ProfileCardStatic({ profile, stats, loading, onDownload }: ProfileCardProps) {
  if (loading) {
    return (
      <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
        </div>
      </div>
    );
  }

  const rankLevel = stats?.rank?.level ?? '?';
  const design = rankDesignSystem[rankLevel] ?? rankDesignSystem['?'];
  const currentYear = new Date().getFullYear();

  // 랭크별 스타일 직접 정의 (인라인 스타일로 적용)
  const getRankStyle = (rankLevel: string) => {
    const styles: {[key: string]: any} = {
      headerBg: '',
      headerBorderColor: '',
      cardShadow: '',
      rankTextColor: '',
    };

    switch(rankLevel) {
      case 'S':
        styles.headerBg = 'linear-gradient(to bottom right, #f5f3ff, #ede9fe)';
        styles.headerBorderColor = '#7c3aed';
        styles.cardShadow = '0 0 15px rgba(168,85,247,0.5)';
        styles.rankTextColor = '#7c3aed';
        break;
      case 'A+':
        styles.headerBg = 'linear-gradient(to bottom right, #eff6ff, #e0f2fe)';
        styles.headerBorderColor = '#3b82f6';
        styles.cardShadow = '0 0 10px rgba(59,130,246,0.4)';
        styles.rankTextColor = '#2563eb';
        break;
      case 'A':
        styles.headerBg = 'linear-gradient(to bottom right, #eff6ff, #dbeafe)';
        styles.headerBorderColor = '#60a5fa';
        styles.cardShadow = '0 0 8px rgba(59,130,246,0.3)';
        styles.rankTextColor = '#3b82f6';
        break;
      case 'A-':
        styles.headerBg = 'linear-gradient(to bottom right, #f0f9ff, #e0f7ff)';
        styles.headerBorderColor = '#38bdf8';
        styles.cardShadow = '0 0 6px rgba(14,165,233,0.3)';
        styles.rankTextColor = '#0ea5e9';
        break;
      case 'B+':
        styles.headerBg = 'linear-gradient(to bottom right, #ecfdf5, #d1fae5)';
        styles.headerBorderColor = '#10b981';
        styles.cardShadow = '0 4px 6px rgba(16,185,129,0.1)';
        styles.rankTextColor = '#10b981';
        break;
      // 기타 랭크...
      default:
        styles.headerBg = 'white';
        styles.headerBorderColor = '#e5e7eb';
        styles.cardShadow = '0 4px 6px rgba(0,0,0,0.1)';
        styles.rankTextColor = '#6b7280';
    }

    return styles;
  };

  const rankStyle = getRankStyle(rankLevel);

  return (
    <div 
      className={`relative min-h-[600px] min-w-[500px] rounded-lg overflow-hidden border-2 transition-all duration-300`}
      style={{
        borderColor: rankStyle.headerBorderColor,
        boxShadow: rankStyle.cardShadow,
        backgroundColor: profile.theme === 'dark' ? '#1f2937' : 'white'
      }}
    >
      <div 
        className={`p-6`} 
        style={{ 
          background: profile.theme === 'dark' ? '#1f2937' : rankStyle.headerBg,
          borderColor: rankStyle.headerBorderColor 
        }}
      >
        <div className="flex items-center gap-4">
          {stats?.avatarUrl && (
            <div 
              className={`relative w-20 h-20 rounded-full overflow-hidden border-2 p-0.5`}
              style={{ 
                borderColor: rankStyle.headerBorderColor,
                backgroundColor: profile.theme === 'dark' ? '#1f2937' : 'white' 
              }}
            >
              <img
                src={stats.avatarUrl}
                alt={profile.name}
                className="object-cover rounded-full w-full h-full"
              />
            </div>
          )}
          <div>
            <h2 
              className="text-2xl font-bold" 
              style={{ color: profile.theme === 'dark' ? 'white' : '#111827' }}
            >
              {profile.name || stats?.name || '이름 없음'}
            </h2>
            <p 
              className="flex items-center"
              style={{ color: profile.theme === 'dark' ? '#9ca3af' : '#4b5563' }}
            >
              @{profile.githubUsername}
            </p>
          </div>
        </div>
      </div>

      <div 
        className="relative"
        style={{ 
          backgroundColor: profile.theme === 'dark' ? '#1f2937' : 'white',
        }}
      >
        {profile.backgroundImageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={profile.backgroundImageUrl}
              alt="Body Background"
              className="object-contain w-full h-full"
              style={{ opacity: 0.15 }}
            />
            <div 
              className="absolute inset-0"
              style={{
                backgroundColor: profile.theme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.3)' 
                  : 'rgba(255, 255, 255, 0.3)'
              }}
            ></div>
          </div>
        )}

        <div className="relative z-10 p-6">
          <div 
            className="text-lg font-semibold mb-2"
            style={{ color: profile.theme === 'dark' ? '#e5e7eb' : '#1f2937' }}
          >
            소개
          </div>
          <p 
            className="mb-4 p-2 rounded-lg shadow-sm"
            style={{ 
              color: profile.theme === 'dark' ? '#d1d5db' : 'inherit',
              backgroundColor: profile.theme === 'dark' 
                ? 'rgba(31, 41, 55, 0.7)' 
                : 'rgba(255, 255, 255, 0.7)'
            }}
          >
            {profile.bio || stats?.bio || '소개가 없습니다.'}
          </p>

          {profile.skills.length > 0 && (
            <div 
              className="h-px my-4" 
              style={{ 
                background: profile.theme === 'dark'
                  ? 'linear-gradient(to right, transparent, #6b7280, transparent)'
                  : 'linear-gradient(to right, transparent, #9ca3af, transparent)'
              }}
            ></div>
          )}

          {profile.skills.length > 0 && (
            <>
              <div 
                className="text-lg font-semibold mb-2"
                style={{ color: profile.theme === 'dark' ? '#e5e7eb' : '#1f2937' }}
              >
                기술스택
              </div>
              <div className="grid grid-cols-4 gap-2 mb-6">
                {profile.skills.map((skill) => (
                  <SimpleTechBadge key={skill} tech={skill} />
                ))}
              </div>
            </>
          )}

          {profile.skills.length > 0 && stats && (
            <div 
              className="h-px my-6" 
              style={{ 
                background: profile.theme === 'dark'
                  ? 'linear-gradient(to right, transparent, #6b7280, transparent)'
                  : 'linear-gradient(to right, transparent, #9ca3af, transparent)'
              }}
            ></div>
          )}

          {stats && (
            <>
              <div 
                className="text-lg font-semibold"
                style={{ color: profile.theme === 'dark' ? '#e5e7eb' : '#1f2937' }}
              >
                GitHub 통계
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                <div 
                  className={`flex flex-row justify-center items-center gap-3 text-center p-3 rounded-lg shadow-sm`}
                  style={{ 
                    backgroundColor: profile.theme === 'dark' 
                      ? 'rgba(31, 41, 55, 0.6)' 
                      : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div 
                    className="text-sm"
                    style={{ color: profile.theme === 'dark' ? '#d1d5db' : '#4b5563' }}
                  >
                    Commits | {currentYear}
                  </div>
                  <div 
                    className="text-xl font-bold"
                    style={{ color: profile.theme === 'dark' ? 'white' : '#111827' }}
                  >
                    {stats.currentYearCommits ?? '-'}
                  </div>
                </div>
                <div 
                  className={`flex flex-row justify-center items-center gap-3 text-center p-3 rounded-lg shadow-sm`}
                  style={{ 
                    backgroundColor: profile.theme === 'dark' 
                      ? 'rgba(31, 41, 55, 0.6)' 
                      : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div 
                    className="text-sm"
                    style={{ color: profile.theme === 'dark' ? '#d1d5db' : '#4b5563' }}
                  >
                    Total Stars
                  </div>
                  <div 
                    className="text-xl font-bold"
                    style={{ color: profile.theme === 'dark' ? 'white' : '#111827' }}
                  >
                    {stats.totalStars ?? '-'}
                  </div>
                </div>
                <div 
                  className={`flex flex-row justify-center items-center gap-3 text-center p-3 rounded-lg shadow-sm`}
                  style={{ 
                    backgroundColor: profile.theme === 'dark' 
                      ? 'rgba(31, 41, 55, 0.6)' 
                      : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div 
                    className="text-sm"
                    style={{ color: profile.theme === 'dark' ? '#d1d5db' : '#4b5563' }}
                  >
                    Total PRs
                  </div>
                  <div 
                    className="text-xl font-bold"
                    style={{ color: profile.theme === 'dark' ? 'white' : '#111827' }}
                  >
                    {stats.totalPRs ?? '-'}
                  </div>
                </div>
                <div 
                  className={`flex flex-row justify-center items-center gap-3 text-center p-3 rounded-lg shadow-sm`}
                  style={{ 
                    backgroundColor: profile.theme === 'dark' 
                      ? 'rgba(31, 41, 55, 0.6)' 
                      : 'rgba(255, 255, 255, 0.7)'
                  }}
                >
                  <div 
                    className="text-sm"
                    style={{ color: profile.theme === 'dark' ? '#d1d5db' : '#4b5563' }}
                  >
                    Total Issues
                  </div>
                  <div 
                    className="text-xl font-bold"
                    style={{ color: profile.theme === 'dark' ? 'white' : '#111827' }}
                  >
                    {stats.totalIssues ?? '-'}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <div 
                  className="inline-block px-6 py-3 rounded-lg"
                  style={{ 
                    backgroundColor: profile.theme === 'dark' 
                      ? 'rgba(31, 41, 55, 0.5)' 
                      : 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  <span 
                    className="text-sm font-medium mr-2"
                    style={{ color: profile.theme === 'dark' ? '#9ca3af' : '#4b5563' }}
                  >
                    Rank | {currentYear} :
                  </span>
                  <span 
                    className={`text-3xl font-bold`}
                    style={{ color: rankStyle.rankTextColor }}
                  >
                    {stats.rank && stats.rank.level}
                  </span>
                </div>
              </div>
              <div className='flex justify-end mt-4'>
                <span 
                  className='text-sm'
                  style={{ color: profile.theme === 'dark' ? '#9ca3af' : '#6b7280' }}
                >
                  created by Please Readme
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 