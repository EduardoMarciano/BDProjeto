import conetion from './conetion.mjs';

import insertUsers          from './insertQueries/users.mjs'
import insertPosts          from './insertQueries/posts.mjs'
import insertProfessor      from './insertQueries/professor.mjs'
import insertDepartments    from './insertQueries/departments.mjs'
import insertDisciplines    from './insertQueries/disciplines.mjs'
import insertUserProfessor  from './insertQueries/userProfessor.mjs'

// Função de Inserção:
async function insertAll(){
  await insertUsers(conetion);
  await insertDepartments(conetion);
  await insertDisciplines(conetion);
  await insertProfessor(conetion);
  await insertUserProfessor(conetion);
  await insertPosts(conetion);
}
insertAll();