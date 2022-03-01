import React, { useState } from 'react';
import { TableComposable, Thead, Tr, Th, Tbody, Td, Caption } from '@patternfly/react-table';
import { Button, Modal, ModalVariant } from '@patternfly/react-core';
import SimpleDropdown from './SimpleDropdown';

const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [exampleChoice] = useState(false)

  const handleModalToggle = (value) => {
    setIsModalOpen(value);
  }

  const repositoriesTest = [{
    name: 'one',
    branches: 'two',
    prs: 'a',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'a',
    branches: 'two',
    prs: 'k',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'b',
    branches: 'two',
    prs: 'k',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'c',
    branches: 'two',
    prs: 'k',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'd',
    branches: 'two',
    prs: 'k',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'e',
    branches: 'two',
    prs: 'b',
    workspaces: 'four',
    lastCommit: 'five'
  }];

  const repositories = [];

  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
    prs: 'Pull requests',
    workspaces: 'Workspaces',
    lastCommit: 'Last commit'
  };
  const isRepoSelectable = repo => repo.name !== 'a';
  const selectableRepos = repositories.filter(isRepoSelectable);
  const [selectedRepoNames, setSelectedRepoNames] = React.useState([]);
  const setRepoSelected = (repo, isSelecting = true) => setSelectedRepoNames(prevSelected => {
    const otherSelectedRepoNames = prevSelected.filter(r => r !== repo.name);
    return isSelecting && isRepoSelectable(repo) ? [...otherSelectedRepoNames, repo.name] : otherSelectedRepoNames;
  });
  const selectAllRepos = (isSelecting = true) => setSelectedRepoNames(isSelecting ? selectableRepos.map(r => r.name) : []);
  const areAllReposSelected = selectedRepoNames.length === selectableRepos.length;
  const isRepoSelected = repo => selectedRepoNames.includes(repo.name);
  const [recentSelectedRowIndex, setRecentSelectedRowIndex] = React.useState(null);
  const [shifting, setShifting] = React.useState(false);
  const onSelectRepo = (repo, rowIndex, isSelecting) => {
    if (shifting && recentSelectedRowIndex !== null) {
      const numberSelected = rowIndex - recentSelectedRowIndex;
      const intermediateIndexes = numberSelected > 0 ? Array.from(new Array(numberSelected + 1), (_x, i) => i + recentSelectedRowIndex) : Array.from(new Array(Math.abs(numberSelected) + 1), (_x, i) => i + rowIndex);
      intermediateIndexes.forEach(index => setRepoSelected(repositories[index], isSelecting));
    } else {
      setRepoSelected(repo, isSelecting);
    }
    setRecentSelectedRowIndex(rowIndex);
  };
  React.useEffect(() => {
    const onKeyDown = e => {
      if (e.key === 'Shift') {
        setShifting(true);
      }
    };
    const onKeyUp = e => {
      if (e.key === 'Shift') {
        setShifting(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);
  return (
    <div>
      <Button variant="primary" onClick={handleModalToggle}>
        Show modal
      </Button>
      <TableComposable aria-label="Simple table" variant={exampleChoice !== 'default' ? 'compact' : undefined} borders={exampleChoice !== 'compactBorderless'}>
        <Caption>Simple table using composable components</Caption>
        <Thead>
          <Tr>
            <Th>{columnNames.name}</Th>
            <Th>{columnNames.branches}</Th>
            <Th>{columnNames.prs}</Th>
            <Th>{columnNames.workspaces}</Th>
            <Th>{columnNames.lastCommit}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {repositories.map(repo => <Tr key={repo.name}>
            <Td dataLabel={columnNames.name}>{repo.name}</Td>
            <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
            <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
            <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
            <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
          </Tr>)}
        </Tbody>
      </TableComposable>
      <Modal
      style={{minHeight:"20rem"}}
        title="Simple modal header"
        isOpen={isModalOpen}
        onClose={()=>handleModalToggle(false)}
        variant={ModalVariant.medium}
        actions={[
          <Button key="confirm" variant="primary" onClick={handleModalToggle}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={()=>handleModalToggle(false)}>
            Cancel
          </Button>
        ]}
      >
        <div className="filter__collectiontype">
          Collection Type: <SimpleDropdown/>
        </div>
        <div className="filter__advance">

        </div>
        <div className="filtered__result">
          <TableComposable aria-label="Selectable table">
            <Thead>
              <Tr>
                <Th select={{
                  onSelect: (_event, isSelecting) => selectAllRepos(isSelecting),
                  isSelected: areAllReposSelected
                }} />
                <Th>{columnNames.name}</Th>
                <Th>{columnNames.branches}</Th>
                <Th>{columnNames.prs}</Th>
                <Th>{columnNames.workspaces}</Th>
                <Th>{columnNames.lastCommit}</Th>
              </Tr>
            </Thead>
            <Tbody>
              {repositories.map((repo, rowIndex) => <Tr key={repo.name}>
                <Td select={{
                  rowIndex,
                  onSelect: (_event, isSelecting) => onSelectRepo(repo, rowIndex, isSelecting),
                  isSelected: isRepoSelected(repo),
                  disable: !isRepoSelectable(repo)
                }} />
                <Td dataLabel={columnNames.name}>{repo.name}</Td>
                <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
                <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
                <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
                <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
              </Tr>)}
            </Tbody>
          </TableComposable>
        </div>
      </Modal>
    </div>
  )
};

export default App;