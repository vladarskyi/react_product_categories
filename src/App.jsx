/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

const getPreparedProducts = (products, option) => {
  const { query = '', userSelected = null } = option;

  let preparedProducts = [...products];

  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery) {
    preparedProducts = preparedProducts.filter(product => product.name
      .toLowerCase().includes(normalizedQuery));
  }

  if (userSelected !== 'All') {
    preparedProducts = preparedProducts.filter((product) => {
      const category = getCategoryById(product.categoryId);

      return category.ownerId === userSelected.id;
    });
  }

  return preparedProducts;
};

const getCategoryById = categoryId => categoriesFromServer
  .find(category => category.id === categoryId) || null;

const getUserById = userId => usersFromServer
  .find(user => user.id === userId) || null;

export const App = () => {
  // const [selectedCategories, setSelectedCategories] = useState([]);

  // const isCategorySelected = ({ id }) => selectedCategories
  //   .some(category => category.id === id);

  // const addCaterogy = category => {
  //   setSelectedCategories([...selectedCategories, category]);
  // };

  // const removeCategory = category => {
  //   setSelectedCategories(
  //     selectedCategories.filter(cat => cat.id !== category.id),
  //   );
  // };

  const [userSelected, setUserSelected] = useState('All');
  const [query, setQuery] = useState('');

  const visibleProducts = getPreparedProducts(productsFromServer, {
    query,
    userSelected,
  });

  const isAnyVisibleProducts = visibleProducts.length > 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                className={cn({ 'is-active': userSelected === 'All' })}
                href="#/"
                onClick={() => setUserSelected('All')}
              >
                All
              </a>

              {usersFromServer.map((user) => {
                const { name, id } = user;
                const isThisUserSelected = name === userSelected.name;

                return (
                  <a
                    data-cy="FilterUser"
                    className={cn({ 'is-active': isThisUserSelected })}
                    href="#/"
                    onClick={() => setUserSelected(user)}
                    key={id}
                  >
                    {name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  onChange={event => setQuery(event.target.value)}
                  value={query}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      onClick={() => setQuery('')}
                      type="button"
                      className="delete"
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  // is-info
                  className="button mr-2 my-1"
                  href="#/"
                  key={category.id}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setQuery('');
                  setUserSelected('All');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {isAnyVisibleProducts ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map((product) => {
                  const category = getCategoryById(product.categoryId);
                  const user = getUserById(category.ownerId);
                  const isMale = user.sex === 'm';
                  const isFemale = user.sex === 'f';

                  return (
                    <tr data-cy="Product" key={product.id}>
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        {product.id}
                      </td>

                      <td data-cy="ProductName">{product.name}</td>
                      <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>

                      <td
                        data-cy="ProductUser"
                        className={cn({
                          'has-text-link': isMale,
                          'has-text-danger': isFemale,
                        })}
                      >
                        {user.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
