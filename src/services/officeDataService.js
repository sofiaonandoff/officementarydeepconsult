// 오피스 데이터를 저장하고 관리하는 서비스

// 로컬 스토리지 키
const STORAGE_KEY = 'office_design_data';

// 데이터 저장
export const saveOfficeData = (data) => {
  try {
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = {
      ...data,
      timestamp,
      id: `design_${timestamp}`,
    };

    // 기존 데이터 가져오기
    const existingData = getOfficeData();

    // 새 데이터 추가
    const updatedData = [...existingData, dataWithTimestamp];

    // 로컬 스토리지에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));

    return dataWithTimestamp;
  } catch (error) {
    console.error('데이터 저장 중 오류 발생:', error);
    throw error;
  }
};

// 모든 데이터 가져오기
export const getOfficeData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
    return [];
  }
};

// 특정 데이터 가져오기
export const getOfficeDataById = (id) => {
  try {
    const allData = getOfficeData();
    return allData.find(item => item.id === id);
  } catch (error) {
    console.error('데이터 조회 중 오류 발생:', error);
    return null;
  }
};

// 데이터 삭제
export const deleteOfficeData = (id) => {
  try {
    const allData = getOfficeData();
    const updatedData = allData.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('데이터 삭제 중 오류 발생:', error);
    throw error;
  }
};

// 데이터 내보내기 (CSV 형식)
export const exportOfficeData = () => {
  try {
    const data = getOfficeData();
    if (data.length === 0) return null;

    // CSV 헤더 생성
    const headers = [
      'ID',
      '타임스탬프',
      '공간 크기(평)',
      '총 인원',
      '예산 범위',
      '좌석제도',
      '업무 형태',
      '업무 공간 유연성',
      '워크스테이션 수',
      '워크스테이션 크기',
      '개인 락커 수',
      '1인 포커스룸 수',
      '2인 포커스룸 수',
      '임원실 수',
      '소형 회의실 수',
      '중형 회의실 수',
      '대형 회의실 수',
      '컨퍼런스룸 수',
      '추가 공간'
    ].join(',');

    // CSV 데이터 행 생성
    const rows = data.map(item => {
      const additionalSpaces = Object.entries(item.additionalSpaces)
        .filter(([_, space]) => space.required)
        .map(([type, space]) => `${type}(${space.size || '크기 미지정'})`)
        .join('; ');

      const getWorkStyleLabel = (id, item) => ({
        'startup': '스타트업',
        'finance': '재무/금융',
        'tech': 'IT/기술',
        'creative': '크리에이티브',
        'consulting': '컨설팅',
        'research': '연구/개발',
        'marketing': '마케팅',
        'general': '일반 사무',
        'other': item.workStyleOther || '기타'
      }[id] || id);

      return [
        item.id,
        item.timestamp,
        item.spaceSize,
        item.totalEmployees,
        item.budget,
        item.seatingType === 'fixed' ? '고정좌석제' : '자율좌석제',
        Array.isArray(item.workStyle)
          ? item.workStyle.map(id => getWorkStyleLabel(id, item)).filter(Boolean).join(', ')
          : item.workStyle,
        item.workStyleFlexibility,
        item.workstations.count,
        item.workstations.size,
        item.lockers.count,
        item.focusRooms.single.count,
        item.focusRooms.double.count,
        item.executiveRooms.count,
        item.meetingRooms.small.count,
        item.meetingRooms.medium.count,
        item.meetingRooms.large.count,
        item.meetingRooms.conference.count,
        additionalSpaces
      ].join(',');
    });

    // CSV 문자열 생성
    const csv = [headers, ...rows].join('\n');

    // CSV 파일 다운로드
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `office_design_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('데이터 내보내기 중 오류 발생:', error);
    throw error;
  }
}; 